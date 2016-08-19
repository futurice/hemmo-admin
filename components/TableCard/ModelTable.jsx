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
import Account from 'material-ui/svg-icons/action/account-circle';
import FlatButton from 'material-ui/FlatButton';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';

import Dimensions from '../dimensions';

class ModelTable extends Component {
  constructor(props) {
    super(props);

    this.getHeaderColumns = this.getHeaderColumns.bind(this);
    this.getRowColumns = this.getRowColumns.bind(this);
  }

  getHeaderColumns() {
    let columns = [];

    this.props.header.forEach((header, index) => {
      if (header.maxShowWidth && this.props.containerWidth < header.maxShowWidth) {
        return;
      }

      columns.push(
        <TableHeaderColumn style={ header.style } key={index}> { header.columnTitle || '' } </TableHeaderColumn>
      );
    });

    return columns;
  }

  getRowColumns(row, index) {
    let columns = [];

    this.props.header.forEach((header, index) => {
      if (header.maxShowWidth && this.props.containerWidth < header.maxShowWidth) {
        return;
      }

      let body = header.component;
      let style = header.style;

      if (!body && header.value) {
        body = header.value(row);
      }

      if (!body) {
        body = header.defaultValue;

        if (header.defaultValueStyle) {
          style = header.defaultValueStyle;
        }
      }

      columns.push(
        <TableRowColumn
          style={ style }
          key={ index } >

          { body }
        </TableRowColumn>
      );
    });

    return (
      <TableRow key={index} onTouchTap={(e) => {
        this.props.onClickRow(row.id);
      }}>
        { columns }
      </TableRow>
    );
  }

  render() {
    const entries = this.props.entries;

    const palette = this.context.muiTheme.palette;
    const spacing = this.context.muiTheme.spacing;

    return(
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            { this.getHeaderColumns() }
          </TableRow>
        </TableHeader>

        <TableBody showRowHover={true} displayRowCheckbox={false}>
          {entries.map((row, index) => (
            this.getRowColumns(row, index)
          ))}
        </TableBody>
      </Table>
    );
  }
}

ModelTable.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

ModelTable.propTypes = {
  entries: PropTypes.array.isRequired,
  header: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickRow: PropTypes.func.isRequired
};

export default Dimensions()(ModelTable);
