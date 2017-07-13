import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import { red300, lightGreen300 } from 'material-ui/styles/colors';
import rest from '../utils/rest';
import { push } from 'react-router-redux';

import ArrowForward from 'material-ui-icons/ArrowForward';
import Done from 'material-ui-icons/Done';
import AlertErrorOutline from 'material-ui-icons/ErrorOutline';

import { FormattedMessage, injectIntl } from 'react-intl';

import TableCard from '../components/TableCard';
import PageHeader from '../components/PageHeader';


@injectIntl
class FeedbackTable extends React.Component {
  state = {
    page: 0,
    pageEntries: 20,
    assigneeId: '',
    name1: '',  // Child's name
    name2: '',  // Employee name
    orderBy: 'assigneeName',
    order: 'asc'
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
      assigneeId: params.assigneeId,
      childName: params.name1,
      assigneeName: params.name2,
      orderBy: params.orderBy,
      order: params.order
    };

    dispatch(rest.actions.feedback(queryParams));
  }

  openFeedback(id) {
    const path = '/feedback/' + id;
    this.props.dispatch(push(path));
  }

  sortByColumn(sortParams) {
    this.setState({...this.state, sortParams}, this.refresh);
  }

  render() {
    const initialPage = 0;
    const pageEntries = 20;
    const { intl: { formatMessage } } = this.props;

    return(
      <div>
        <PageHeader header={formatMessage({id: 'Feedback'})} />
        <TableCard
          initialPage={ initialPage }
          pageEntries={ pageEntries }
          model={ this.props.feedback }
          emptyMsg={ this.props.noFeedbackMsg }
          orderBy={this.state.orderBy}
          order={this.state.order}
          customLabels={{
            name1: 'childsName',
            name2: 'employeesName'
          }}
          header={[
            {
              id: null,
              value: row => row.reviewed ?
                <Done style={{ verticalAlign: 'middle' }} color={lightGreen300}/> :
                <AlertErrorOutline style={{ verticalAlign: 'middle' }} color={red300}/>,

              className: 'row-icon',
              maxShowWidth: 320,
              disablePadding: true
            },
            {
              id: 'name',
              value: row => row.childName,
              columnTitle: <FormattedMessage id='child' />
            },
            {
              id: 'assignee',
              value: row => row.assignee,
              columnTitle: <FormattedMessage id='assignee' />,
              defaultValue: '(nobody)',
              maxShowWidth: 680
            },
            {
              id: 'createdAt',
              value: row => new Date(row.createdAt).toLocaleDateString(),
              columnTitle: <FormattedMessage id='feedbackStartDate' />,
              maxShowWidth: 440
            },
            {
              component: (
                <Button style={{
                  minWidth: '40px'
                }}><ArrowForward/></Button>
              ),
              className: 'row-action'
            }
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
    data: PropTypes.object.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

function select(state, ownParams) {
  return {
    location: ownParams.location,
    feedback: state.feedback
  };
}

export default connect(select)(FeedbackTable);
