import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import rest from '../../rest';

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
    const {dispatch} = this.props;
    dispatch(rest.actions.users.sync());
  }

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled
    });
  }

  render() {
    const {users} = this.props;
    //console.log(users);

    return(
      <Table multiSelectable={true}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Assignee</TableHeaderColumn>
            <TableHeaderColumn>Family</TableHeaderColumn>
          </TableRow>
        </TableHeader>

        if (!users.loading && users) {
          <TableBody showRowHover={true}>
            {users.data.map((row, index) => (
              <TableRow key={index} selected={row.selected}>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn>{row.assignee}</TableRowColumn>
                <TableRowColumn>{row.family}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        }
      </Table>
    );
  }
}

UserTable.propTypes = {
  users: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
}

function select(state) {
  return {
    users: state.users
  };
}

export default connect(select)(UserTable);
