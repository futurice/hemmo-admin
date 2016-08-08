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
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {red500} from 'material-ui/styles/colors';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';
import { push } from 'react-router-redux'
import Error from '../Error';

class SessionTable extends Component {
  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
  }

  refresh() {
    const {dispatch} = this.props;
    dispatch(rest.actions.sessions());
  }

  componentDidMount() {
    this.refresh();
  }

  openSession(sessionId) {
    const path = '/sessions/' + sessionId;
    this.props.dispatch(push(path));
  }

  render() {
    const { sessions } = this.props;

    if (sessions.loading) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (!sessions.sync || sessions.data.error) {
      return(
        <Error model={sessions}/>
      );
    } else {
      if (this.props.small) {
        return(
          <Table
          >
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>User</TableHeaderColumn>
                <TableHeaderColumn>Session started</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} displayRowCheckbox={false}>
              {sessions.data.map((row, index) => (
                <TableRow key={index}
                  onTouchTap={(e) => {
                    this.openSession(row.sessionId);
                  }} >
                  <TableRowColumn>{row.user.name}</TableRowColumn>
                  <TableRowColumn>{row.startedAt}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      } else {
        return(
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>User</TableHeaderColumn>
                <TableHeaderColumn>Session started</TableHeaderColumn>
                <TableHeaderColumn>Reviewed</TableHeaderColumn>
                <TableHeaderColumn style={{
                  width: '10%'
                }}></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} displayRowCheckbox={false}>
              {sessions.data.map((row, index) => (
                <TableRow key={index} onTouchTap={(e) => {
                  this.openSession(row.sessionId);
                }} >
                  <TableRowColumn>{row.user.name}</TableRowColumn>
                  <TableRowColumn>{row.startedAt}</TableRowColumn>
                  <TableRowColumn>{row.reviewed.toString()}</TableRowColumn>
                  <TableRowColumn style={{ width: '10%' }}>
                    <RaisedButton onTouchTap={(e) => {
                        this.openSession(row.sessionId);
                    }} label="Open" primary={true} fullWidth={true} />
                  </TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      }
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
