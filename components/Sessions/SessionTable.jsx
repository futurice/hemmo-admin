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

import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchSessions from '../../actions/api/sessions';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {red500} from 'material-ui/styles/colors';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';

class SessionTable extends Component {
  constructor(props) {
    super(props);

    // for toggles states
    this.state = {};
  }

  componentDidMount() {
    this.props.actions.start();
  }

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled
    });
  }

  openSession(sessionId) {
    console.log(sessionId);
    const path = '/app/sessions/' + sessionId;
     this.props.router.push(path);
  }

  render() {
    const { sessions, loading, error } = this.props;

    if (loading) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (error || !sessions) {
      return(
        <div style={{
          margin: this.context.muiTheme.spacing.desktopGutter
        }}>
          <Card>
            <CardHeader
              title="Error fetching session data"
              subtitle="Something went wrong when trying to fetch the session table"
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
      console.log(sessions[0])
      return(
        <Table multiSelectable={true}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>User</TableHeaderColumn>
              <TableHeaderColumn>Session started</TableHeaderColumn>
              <TableHeaderColumn>Reviewed</TableHeaderColumn>
              <TableHeaderColumn>Open session</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true}>
            {sessions.map((row, index) => (
              <TableRow key={index} selected={row.selected}>
                <TableRowColumn>{row.user.name}</TableRowColumn>
                <TableRowColumn>{row.startedAt}</TableRowColumn>
                <TableRowColumn>{row.reviewed.toString()}</TableRowColumn>
                <TableRowColumn>
                  <FlatButton onTouchTap={(e) => {
                      this.openSession(row.sessionId);
                  }} label="Open" primary={true}/>
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
  }
}

function mapStateToProps(state) {
  console.log(state.sessions);
  return {
    sessions: state.sessions.data.sessions,
    loading: state.sessions.loading,
    error: state.sessions.error
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(fetchSessions, dispatch)
  };
}

SessionTable.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionTable));
