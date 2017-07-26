import React from 'react';
import PropTypes from 'prop-types';

import { CircularProgress } from 'material-ui/Progress';

import CardToolbar from './CardToolbar';
import ModelTable from './ModelTable';

class TableCard extends React.Component {
  render() {
    const { model, customLabels, hideElems } = this.props;

    let body = null;
    if (model.loading) {
      body = (
        <div style={{ textAlign: 'center' }}>
          <CircularProgress />
        </div>
      );
    } else if (!this.props.model.data.entries.length && this.props.emptyMsg) {
      return (
        <div>
          {this.props.emptyMsg}
        </div>
      );
    } else {
      body = (
        <ModelTable
          order={this.props.order}
          orderBy={this.props.orderBy}
          header={this.props.header}
          entries={this.props.model.data.entries}
          onClickRow={this.props.onClickRow}
          onSortRequest={this.props.refresh}
        />
      );
    }

    let toolbar = this.props.hideToolbar
      ? null
      : <CardToolbar
          refresh={this.props.refresh}
          totalEntries={this.props.model.data.meta.count}
          initialPage={parseInt(this.props.initialPage, 10)}
          pageEntries={parseInt(this.props.pageEntries, 10)}
          hideElems={hideElems || []}
          customLabels={customLabels || {}}
        />;

    return (
      <div>
        {toolbar}
        {body}
      </div>
    );
  }
}

TableCard.propTypes = {
  model: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      entries: PropTypes.array.isRequired,
      meta: PropTypes.shape({
        count: PropTypes.number.isRequired,
        limit: PropTypes.number.isRequired,
        offset: PropTypes.number.isRequired,
      }),
    }).isRequired,
  }).isRequired,
  header: PropTypes.arrayOf(PropTypes.object).isRequired,
  refresh: PropTypes.func.isRequired,
  onClickRow: PropTypes.func.isRequired,
  margin: PropTypes.number,
  hideElems: PropTypes.array,
  customLabels: PropTypes.object,
};

export default TableCard;
