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
import * as Actions from '../../actions/api/user';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {red500} from 'material-ui/styles/colors';

const tableData = [
  {
    name: 'Laryn Lincoln',
    assignee: 'Maleah Tailor',
    family: 'Southgate'
  }, {
    name: 'Doreen Garey',
    assignee: 'Maleah Tailor',
    family: 'Southgate'
  }, {
    name: 'Gray Tanner',
    assignee: 'Dean Bishop',
    family: 'Eccleston'
  }
];

class UserTable extends Component {
  constructor(props) {
    super(props);

    // for toggles states
    this.state = {};
  }

  componentDidMount() {
    this.props.actions.fetchUsersStart();
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
      console.log(error);
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
            />
            <CardTitle title="Additional information" />
            <CardText>
              {String(error)}
            </CardText>
            <CardActions>
              <FlatButton label="Reload"
                          onTouchTap={this.props.actions.fetchUsersStart}
                          primary={true} />
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
    }
  }
}

function mapStateToProps(state) {
  return {
    users: state.api.get('data'),
    loading: state.api.get('loading'),
    error: state.api.get('error')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

UserTable.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTable);
