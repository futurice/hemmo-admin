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
import fetchSession from '../../actions/api/sessionsDetail';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {red500} from 'material-ui/styles/colors';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';
import { withRouter } from 'react-router';

/*
class SessionDetail extends Component {
  constructor(props) {
    super(props);
    // for toggles states
    this.state = {
      attachmentOpen: false,
      openAttachmentContentId: null
    };
  }

  handleClose = () => {
    this.setState({
      attachmentOpen: false,
      openAttachmentContentId: null});
  };

  refresh() {
    const {dispatch} = this.props;
    console.log(this.props);
    dispatch(rest.actions.session({id: this.props.params.id}));
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
    console.log("Somehow mark reviewed here");
  }

  render() {
    console.log(session);
    const { session, loading, error } = this.props;
    if (loading) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (error || !session) {
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
                          onTouchTap={() => this.refresh()}
                          primary={true}
                          icon={<Refresh/>} />
            </CardActions>
          </Card>
        </div>
      );
    } else {
      return(
        <div style={{
          margin: this.context.muiTheme.spacing.desktopGutter
        }}>
          <Card>
            <CardTitle title="Session overview" />
            <CardText>
              User: {session.user.name}<br></br>
              Review status: {session.reviewed.toString()}<br></br>
              Started: {session.startedAt}
            </CardText>
            <CardActions>
              <FlatButton label="Mark reviewed"
                          onTouchTap={() => {
                            this.markReviewed()
                          }}
                          primary={true}
                          icon={<Refresh/>} />
            </CardActions>

          </Card>
          <Dialog
            title="Attachment"
            modal={false}
            open={this.state.attachmentOpen}
            onRequestClose={this.handleClose}
          >
            <Attachment contentId={this.state.openAttachmentContentId} />
          </Dialog>

          <Table>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Question</TableHeaderColumn>
                <TableHeaderColumn>Answer</TableHeaderColumn>
                <TableHeaderColumn>Date</TableHeaderColumn>
                <TableHeaderColumn>Open attachment</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} displayRowCheckbox={false}>
              {session.data.map((row, index) => (
                <TableRow key={index} selected={row.selected}>
                  <TableRowColumn>{row.question}</TableRowColumn>
                  <TableRowColumn>{row.answer}</TableRowColumn>
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
        </div>
      );
    }
  }
}



SessionDetail.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

SessionDetail.propTypes = {
  session: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
};

function select(state) {
  console.log(state);
  return { session: state.session };
}

export default connect(select)(SessionDetail);
*/

export default class SessionDetail extends Component {
  render() {
    console.dir(this.props);
    return <h3>{this.props.params}</h3>;
  }
}
