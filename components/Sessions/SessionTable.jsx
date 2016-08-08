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
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {red500} from 'material-ui/styles/colors';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';
import { push } from 'react-router-redux'

class SessionTable extends Component {
  constructor(props) {
    super(props);

    // for toggles states
    this.state = {};
    this.refresh = this.refresh.bind(this);
  }

  refresh() {
    const {dispatch} = this.props;
    dispatch(rest.actions.sessions());
  }

  componentDidMount() {
    this.refresh();
  }

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled
    });
  }

  openSession(sessionId) {
    const path = '/sessions/' + sessionId;
    this.props.dispatch(push(path));
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
                          onTouchTap={() => this.refresh()}
                          primary={true}
                          icon={<Refresh/>} />
            </CardActions>
          </Card>
        </div>
      );
    } else {
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
            {sessions.data.map((row, index) => (
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

SessionTable.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

SessionTable.propTypes = {
  sessions: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

function select(state) {
  return { sessions: state.sessions };
}

export default withRouter(connect(select)(SessionTable));
