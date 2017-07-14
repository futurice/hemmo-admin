import React from 'react';
import PropTypes from 'prop-types';

import Table, {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
} from 'material-ui/Table';

const windowWidth = window.innerWidth;

export default class ModelTable extends React.Component {
  sortHandler = property => event => {
    const orderBy = property;
    let order = 'asc';

    if (this.props.orderBy === property && this.props.order === 'asc') {
      order = 'desc';
    }

    this.props.onSortRequest({
      page: 0,
      orderBy,
      order,
    });
  };

  getHeaderColumns = () => {
    let columns = [];

    this.props.header.forEach((header, index) => {
      if (header.maxShowWidth && windowWidth < header.maxShowWidth) {
        return;
      }

      const sortLabel =
        this.props.tableSort !== false
          ? <TableSortLabel
              active={this.props.orderBy === header.id}
              order={this.props.order}
              onClick={this.sortHandler(header.id)}
            >
              {header.columnTitle || ''}
            </TableSortLabel>
          : null;

      columns.push(
        <TableCell
          style={header.style}
          key={index}
          disablePadding={header.disablePadding}
          className={header.className}
        >
          {sortLabel ? sortLabel : header.columnTitle || ''}
        </TableCell>,
      );
    });

    return columns;
  };

  getRowColumns = (row, index) => {
    let columns = [];

    this.props.header.forEach((header, index) => {
      if (header.maxShowWidth && windowWidth < header.maxShowWidth) {
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
          style={style}
          key={index}
          disablePadding={this.props.header[index].disablePadding}
          className={this.props.header[index].className}
        >
          {body}
        </TableCell>,
      );
    });

    return (
      <TableRow
        hover
        key={index}
        onClick={e => {
          this.props.onClickRow(row.id);
        }}
      >
        {columns}
      </TableRow>
    );
  };

  render() {
    const entries = this.props.entries;

    return (
      <Table>
        <TableHead>
          <TableRow>
            {this.getHeaderColumns()}
          </TableRow>
        </TableHead>

        <TableBody>
          {entries.map((row, index) => this.getRowColumns(row, index))}
        </TableBody>
      </Table>
    );
  }
}

ModelTable.propTypes = {
  entries: PropTypes.array.isRequired,
  header: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickRow: PropTypes.func.isRequired,
  onSortRequest: PropTypes.func,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  tableSort: PropTypes.bool,
};
