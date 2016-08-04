import { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchAttachment from '../../actions/api/attachment';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {red500} from 'material-ui/styles/colors';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';


class Attachment extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.actions.start();
  }

  render() {
    const { data, loading, error } = this.props;
    console.log(data);
    if (loading || data.length === 0) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (error || !data) {
      return(
        <div style={{
          margin: this.context.muiTheme.spacing.desktopGutter
        }}>
          <Card>
            <CardHeader
              title="Error fetching session data"
              subtitle="Something went wrong when trying to fetch the session data"
              style={{
                backgroundColor: red500
              }}
              avatar={<ErrorOutline/>} />
            <CardTitle title="Additional information" />
            <CardText>
              {String(error)}
            </CardText>
            <CardActions>
              <FlatButton label="Reload"
                          onTouchTap={() => this.props.actions.start()}
                          primary={true}
                          icon={<Refresh/>} />
            </CardActions>
          </Card>
        </div>
      );
    } else {
      return(
        <div>
          {this.props.contentId}
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    data: state.attachmentApi.get('data'),
    loading: state.attachmentApi.get('loading'),
    error: state.attachmentApi.get('error')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(fetchAttachment, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Attachment);
