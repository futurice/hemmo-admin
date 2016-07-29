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

import FlatButton from 'material-ui/FlatButton';

const tableData = [
  {
    name: 'Laryn Lincoln',
    assignee: 'Maleah Tailor',
    family: 'Southgate',
    date: new Date('2016-05-17T15:24:30')
  }, {
    name: 'Doreen Garey',
    assignee: 'Maleah Tailor',
    family: 'Southgate',
    date: new Date('2016-04-06T12:45:26')
  }, {
    name: 'Gray Tanner',
    assignee: 'Dean Bishop',
    family: 'Eccleston',
    date: new Date('2016-04-06T12:45:26')
  }
];

class SessionTable extends Component {
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
            <TableHeaderColumn>Family</TableHeaderColumn>
            <TableHeaderColumn>Date</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody showRowHover={true}>
          {tableData.map((row, index) => (
            <TableRow key={index} selected={row.selected}>
              <TableRowColumn>{row.name}</TableRowColumn>
              <TableRowColumn>{row.family}</TableRowColumn>
              <TableRowColumn>{row.date.toISOString().substring(0, 10)}</TableRowColumn>
              <TableRowColumn style={{textAlign: 'right'}}><FlatButton label="Open" primary={true}/></TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default SessionTable;
