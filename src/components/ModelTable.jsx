import React from 'react';
import PropTypes from 'prop-types';

import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from 'material-ui/Table';

export default class ModelTable extends React.Component {
  getHeaderColumns = () => {
    let columns = [];

    this.props.header.forEach((header, index) => {
      if (header.maxShowWidth && this.props.containerWidth < header.maxShowWidth) {
        return;
      }

      columns.push(
        <TableCell style={ header.style } key={index}> { header.columnTitle || '' } </TableCell>
      );
    });

    return columns;
  }

  getRowColumns = (row, index) => {
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
        <TableCell
          style={ style }
          key={ index } >
          { body }
        </TableCell>
      );
    });

    return (
      <TableRow hover key={index} onClick={(e) => {
        this.props.onClickRow(row.id);
      }}>
        { columns }
      </TableRow>
    );
  }

  render() {
    const entries = this.props.entries;

    return(
      <Table>
        <TableHead>
          <TableRow>
            { this.getHeaderColumns() }
          </TableRow>
        </TableHead>

        <TableBody>
          {entries.map((row, index) => (
            this.getRowColumns(row, index)
          ))}
        </TableBody>
      </Table>
    );
  }
}

ModelTable.propTypes = {
  entries: PropTypes.array.isRequired,
  header: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickRow: PropTypes.func.isRequired
};
