/*
 * React & Redux
 */
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import rest from '../../reducers/api';

/*
 * Components
 */
import SessionContents from './SessionContents';
import Overview from './Overview';
import Attachment from './Attachment';
import Error from '../Error';


/*
 * MaterialUI
 */
import CircularProgress from 'material-ui/CircularProgress';

class SessionDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      attachmentOpen: false,
      openAttachmentContentId: null
    };

    this.openAttachment = this.openAttachment.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  handleClose = () => {
    this.setState({
      attachmentOpen: false,
      openAttachmentContentId: null
    });
  };

  refresh() {
    const {dispatch} = this.props;
    dispatch(rest.actions.sessionDetail({id: this.props.id}));
    dispatch(rest.actions.employees());
  }

  componentDidMount() {
    this.refresh();
  }

  openAttachment(contentId) {
    this.setState({
      attachmentOpen: true,
      openAttachmentContentId: contentId
    });
  }

  render() {
    const { session } = this.props;

    if (session.loading) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (!session.sync || !session.data || session.data.error) {
      return(
        <Error refresh={this.refresh} model={session}/>
      );
    } else {
      return(
        <div>
          <Overview
            session={ session }
            id={ this.props.id }
            employees={ this.props.employees } />

          <SessionContents
            openAttachment={ this.openAttachment }
            contents={ session.data.content } />

          <Attachment
            contentId={this.state.openAttachmentContentId}
            open={this.state.attachmentOpen}
            handleClose={this.handleClose} />
        </div>
      );
    }
  }
}

function select(state, ownProps) {
  return {
    session: state.sessionDetail,
    employees: state.employees,
    id: ownProps.params.id
  };
}

export default connect(select)(SessionDetail);
