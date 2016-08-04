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
import fetchUsers from '../../actions/api/users';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {red500} from 'material-ui/styles/colors';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';

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

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled
    });
  }

  render() {
    let users = this.props.users;

    if (users.loading) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (!users.data) {
      return(
        <div style={{
          margin: this.context.muiTheme.spacing.desktopGutter
        }}>

          <Card>
            <CardHeader
              title="Error fetching user data"
              subtitle="Something went wrong when trying to fetch the user table"
              style={{
                backgroundColor: red500
              }}
              avatar={<ErrorOutline/>} />
            <CardTitle title="Additional information" />
            <CardText>
              Error: {String(users.error)}
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
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Assignee</TableHeaderColumn>
              <TableHeaderColumn>Family</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true}>
            {users.data.map((row, index) => (
              <TableRow key={index} selected={row.selected}>
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
