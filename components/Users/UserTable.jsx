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
  }

  componentDidMount() {
    console.log(this.props);
    const {dispatch} = this.props;
    console.log(rest.actions.users.sync());
    dispatch(rest.actions.users.sync());
    //this.props.actions.start();
  }

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled
    });
  }

  render() {
    const { users, loading, error } = this.props;

    if (loading) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (error || !users) {
      return (
        <div/>
      );
    } else {
      return null;
    
      /*
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
        <Table multiSelectable={true}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Assignee</TableHeaderColumn>
              <TableHeaderColumn>Family</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true}>
            {users.map((row, index) => (
              <TableRow key={index} selected={row.selected}>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn>{row.assignee}</TableRowColumn>
                <TableRowColumn>{row.family}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
      */
    }
  }
}

function mapStateToProps(state) {
  return {
    users: state.usersApi.get('data').users,
    loading: state.usersApi.get('loading'),
    error: state.usersApi.get('error')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(fetchUsers, dispatch)
  };
}

UserTable.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

UserTable.propTypes = {
  users: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

function select(state) {
  return { users: state.users };
}

export default connect(select)(UserTable);
