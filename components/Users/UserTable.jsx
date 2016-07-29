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

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled
    });
  }

  render() {
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
          {tableData.map((row, index) => (
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

export default UserTable;
