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
import Error from '../Error';

class UserTable extends Component {
  constructor(props) {
    super(props);

    // for toggles states
    this.state = {};
    this.refresh = this.refresh.bind(this);
  }

  refresh() {
    const {dispatch} = this.props;
    dispatch(rest.actions.users());
  }

  componentDidMount() {
    this.refresh();
  }

  openUser(userId) {
    const path = '/users/' + userId;
    this.props.dispatch(push(path));
  }

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled
    });
  }

  render() {
    const { users } = this.props;

    if (users.loading) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (!users.sync || !users.data || users.data.error) {
      return(
        <Error refresh={this.refresh} model={users}/>
      );
    } else {
      return(
        <Table multiSelectable={true}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Assignee</TableHeaderColumn>
              <TableHeaderColumn>Family</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} displayRowCheckbox={false}>
            {users.data.map((row, index) => (
              <TableRow key={index} onTouchTap={(e) => {
                this.openUser(row.userId);
              }}>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn>{row.assignee}</TableRowColumn>
                <TableRowColumn>{row.family}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
  }
}

UserTable.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

UserTable.propTypes = {
  users: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

function select(state) {
  return { users: state.users };
}

export default connect(select)(UserTable);
