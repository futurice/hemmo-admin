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
import { red300, lightGreen300 } from 'material-ui/styles/colors';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';
import { push } from 'react-router-redux'
import Error from '../Error';
import ThumbUp from 'material-ui/svg-icons/social/sentiment-satisfied';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import Done from 'material-ui/svg-icons/action/done';
import Announcement from 'material-ui/svg-icons/action/announcement';

class SessionTable extends Component {
  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
  }

  refresh() {
    const {dispatch} = this.props;
    dispatch(rest.actions.sessions(this.props.filter));
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
    } else if (!sessions.sync || !sessions.data || sessions.data.error) {
      return(
        <Error refresh={this.refresh} model={sessions}/>
      );
    } else {
      if (!sessions.data.length) {
        return(
          <div>
            { this.props.noFeedbackMsg || 'No feedback found matching search!' }
            <br/>
            <ThumbUp/>
          </div>
        );
      } else if (this.props.small) {
        return(
          <Table
          >
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={{ width: '20px' }}>Status</TableHeaderColumn>
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
                  <TableRowColumn style={{ width: '20px' }}>
                    {row.reviewed ? <Done color={lightGreen300}/> : <Announcement color={red300}/>}
                  </TableRowColumn>
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
                <TableHeaderColumn style={{ width: '20px' }}>Status</TableHeaderColumn>
                <TableHeaderColumn>User</TableHeaderColumn>
                <TableHeaderColumn>Session started</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '20px' }}></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} displayRowCheckbox={false}>
              {sessions.data.map((row, index) => (
                <TableRow key={index} onTouchTap={(e) => {
                  this.openSession(row.sessionId);
                }} >
                  <TableRowColumn style={{ width: '20px' }}>
                    {row.reviewed ? <Done color={lightGreen300}/> : <Announcement color={red300}/>}
                  </TableRowColumn>
                  <TableRowColumn>{row.user.name}</TableRowColumn>
                  <TableRowColumn>{new Date(row.startedAt).toLocaleDateString()}</TableRowColumn>
                  <TableRowColumn style={{ width: '20px' }}>
                    <FlatButton onTouchTap={(e) => {
                        this.openSession(row.sessionId);
                    }} style={{
                      minWidth: '40px'
                    }} icon={<ArrowForward/>} />
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
