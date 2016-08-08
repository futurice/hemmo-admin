import { Component, PropTypes } from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import Attachment from './Attachment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {red500} from 'material-ui/styles/colors';
import ActionDone from 'material-ui/svg-icons/action/done';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';
import { withRouter } from 'react-router';
import Error from '../Error';

class SessionDetail extends Component {
  constructor(props) {
    super(props);

    // for toggles states
    this.state = {
      attachmentOpen: false,
      openAttachmentContentId: null
    };
    this.markReviewed = this.markReviewed.bind(this);
  }

  handleClose = () => {
    this.setState({
      attachmentOpen: false,
      openAttachmentContentId: null});
  };

  refresh() {
    const {dispatch} = this.props;
    dispatch(rest.actions.sessionDetail({sessionId: this.props.id}));
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

  markReviewed() {
    const self = this;
    const callback = function() {
      self.refresh();
    };
    const {dispatch} = this.props;
    dispatch(rest.actions.sessionUpdate({sessionId: this.props.id}, {
      body: JSON.stringify({
        reviewed: true
      })
    }, callback));
  }

  render() {
    const { session } = this.props;

    console.log(session);
    if (session.loading) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (!session.sync || session.data.error) {
      return(
        <Error model={session}/>
      );
    } else {
      return(
        <div style={{
          margin: this.context.muiTheme.spacing.desktopGutter
        }}>
          <Card>
            <CardTitle title="Session overview" />
            <CardText>
              <div>
                User: {session.data.user.name}<br/>
                Review status: {session.data.reviewed.toString()}<br/>
                Started: {session.data.startedAt}<br/>
              </div>
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn>Question</TableHeaderColumn>
                    <TableHeaderColumn>Answer</TableHeaderColumn>
                    <TableHeaderColumn>Like</TableHeaderColumn>
                    <TableHeaderColumn>Date</TableHeaderColumn>
                    <TableHeaderColumn>Open attachment</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody showRowHover={true} displayRowCheckbox={false}>
                  {session.data.content.map((row, index) => (
                    <TableRow key={index} selected={row.selected}>
                      <TableRowColumn>{row.question}</TableRowColumn>
                      <TableRowColumn>{row.answer}</TableRowColumn>
                      <TableRowColumn>{row.like}</TableRowColumn>
                      <TableRowColumn>{row.createdAt}</TableRowColumn>
                      <TableRowColumn>
                        {row.hasAttachment ?
                          <FlatButton onTouchTap={(e) => {
                              this.openAttachment(row.contentId);
                          }} label="Open attachment" primary={true}/>
                        : null }
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardText>
            {session.reviewed ?
                null :
                <CardActions>
                  <FlatButton label="Mark reviewed"
                              onTouchTap={() => {
                                this.markReviewed()
                              }}
                              primary={true}
                              icon={<ActionDone/>} />
                </CardActions>
            }

          </Card>
          <Dialog
            title="Attachment"
            modal={false}
            open={this.state.attachmentOpen}
            onRequestClose={this.handleClose}
          >
            <Attachment contentId={this.state.openAttachmentContentId} />
          </Dialog>
        </div>
      );
    }
  }
}

SessionDetail.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

function select(state, ownProps) {
  return {
    session: state.sessionDetail,
    id: ownProps.params.id
  };
}

export default connect(select)(SessionDetail);
