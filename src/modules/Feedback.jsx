import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import { red, lightGreen } from 'material-ui/colors';
import rest from '../utils/rest';
import { push } from 'react-router-redux';

import ArrowForward from 'material-ui-icons/ArrowForward';
import Done from 'material-ui-icons/Done';
import AlertErrorOutline from 'material-ui-icons/ErrorOutline';

import { FormattedMessage, injectIntl } from 'react-intl';

import TableCard from '../components/TableCard';
import PageHeader from '../components/PageHeader';

const mapStateToProps = state => ({
  feedback: state.feedback,
  user: state.auth.data.decoded,
});

@injectIntl
class FeedbackTable extends React.Component {
  state = {
    page: 0,
    pageEntries: 20,
    showAll: false,
    assigneeId: '',
    name1: '', // Child's name
    name2: '', // Employee name
    orderBy: 'createdAt',
    order: 'desc',
  };

  componentWillMount() {
    this.refresh();
  }

  refresh(p = {}) {
    const { dispatch } = this.props;
    const params = Object.assign(this.state, p);

    this.setState(params);

    let queryParams = {
      offset: params.page * params.pageEntries,
      limit: params.pageEntries,
      assigneeId: !params.showAll ? this.props.user.id : null,
      childName: params.name1,
      assigneeName: params.name2,
      orderBy: params.orderBy,
      order: params.order,
    };

    dispatch(rest.actions.feedback(queryParams));
  }

  openFeedback(row) {
    const path = `/children/${row.childId}/feedback/${row.id}`;
    this.props.dispatch(push(path));
  }

  sortByColumn(sortParams) {
    this.setState({ ...this.state, sortParams }, this.refresh);
  }

  render() {
    const { intl: { formatMessage } } = this.props;
    let hideElems = [];

    if (!this.state.showAll) {
      hideElems.push('name2');
    }

    return (
      <div>
        <PageHeader header={formatMessage({ id: 'Feedback' })} />
        <TableCard
          initialPage={this.state.page}
          pageEntries={this.state.pageEntries}
          model={this.props.feedback}
          emptyMsg={this.props.noFeedbackMsg}
          orderBy={this.state.orderBy}
          order={this.state.order}
          customLabels={{
            name1: 'childsName',
            name2: 'employeesName',
          }}
          hideElems={hideElems}
          header={[
            {
              id: null,
              value: row =>
                row.reviewed
                  ? <Done color={lightGreen[300]} />
                  : <AlertErrorOutline color={red[300]} />,

              className: 'row-icon',
              maxShowWidth: 320,
              disablePadding: true,
            },
            {
              id: 'childName',
              value: row => row.childName,
              columnTitle: <FormattedMessage id="child" />,
            },
            {
              id: 'assigneeName',
              value: row => row.assigneeName,
              columnTitle: <FormattedMessage id="assignee" />,
              defaultValue: '(nobody)',
              maxShowWidth: 680,
            },
            {
              id: 'createdAt',
              value: row =>
                new Date(
                  row.createdAt,
                ).toLocaleDateString(navigator.languages, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }),
              columnTitle: <FormattedMessage id="feedbackStartDate" />,
              className: 'date',
              maxShowWidth: 440,
            },
            {
              component: (
                <Button>
                  <ArrowForward />
                </Button>
              ),
              className: 'row-action',
            },
          ]}
          onClickRow={this.openFeedback.bind(this)}
          refresh={this.refresh.bind(this)}
        />
      </div>
    );
  }
}

FeedbackTable.propTypes = {
  feedback: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(FeedbackTable);
