import { Component } from 'react';
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
    const { users, loading } = this.props;
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

function mapStateToProps(state) {
  return {
    users: state.api.get('data'),
    loading: state.api.get('loading')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTable);
