import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
//import { LinearProgress } from 'material-ui/Progress';
import Alert from 'material-ui-icons/Warning';
import ArrowForward from 'material-ui-icons/ArrowForward';
import Done from 'material-ui-icons/Done';
import { red, lightGreen, orange } from 'material-ui/styles/colors';
import AlertErrorOutline from 'material-ui-icons/ErrorOutline';

import TableCard from '../components/TableCard';
import PageHeader from '../components/PageHeader';

import rest from '../utils/rest';

@injectIntl
class Children extends React.Component {
  state = {
    page: 0,
    pageEntries: 20,
    showAll: false,
    name1: '',
    name2: '',
    orderBy: 'name',
    order: 'asc',
  };

  // Refresh user list when component is first mounted
  componentWillMount() {
    this.refresh();
  }

  refresh(p = {}) {
    const { dispatch } = this.props;
    const params = Object.assign(this.state, p);

    this.setState({ ...this.state, params });

    let queryParams = {
      offset: params.page * params.pageEntries,
      limit: params.pageEntries,
      assigneeId: !params.showAll ? this.props.user.id : null,
      name: params.name1,
      assigneeName: params.name2,
      orderBy: params.orderBy,
      order: params.order,
    };

    dispatch(rest.actions.children(queryParams));
  }

  refreshUser(userId) {
    this.props.dispatch(push('/children/' + userId));
  }

  render() {
    const { children, intl: { formatMessage } } = this.props;
    let hideElems = [];

    if (!this.state.showAll) {
      hideElems.push('name2');
    }

    return (
      <div>
        <PageHeader header={formatMessage({ id: 'Children' })} />
        <TableCard
          initialPage={this.state.page}
          pageEntries={this.state.pageEntries}
          model={children}
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

              style: { width: '20px' },
              maxShowWidth: 320,
            },
            {
              id: 'name',
              value: row => row.name,
              columnTitle: <FormattedMessage id="name" />,
            },
            {
              id: 'assigneeName',
              value: row => row.assigneeName,
              columnTitle: <FormattedMessage id="assignee" />,
              defaultValue: '(nobody)',
              maxShowWidth: 680,
            },
            {
              id: 'prevFeedbackDate',
              value: row =>
                <div>
                  <span className="icon">
                    {row.showAlerts && row.alert
                      ? <Alert style={{ color: orange[600] }} />
                      : null}
                  </span>
                  {new Date(
                    row.lastFeedbackDate,
                  ).toLocaleDateString(navigator.languages, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </div>,
              columnTitle: <FormattedMessage id="lastFeedback" />,
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
          onClickRow={this.refreshUser.bind(this)}
          refresh={this.refresh.bind(this)}
        />
      </div>
    );
  }
}

Children.propTypes = {
  children: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

function select(state, ownParams) {
  return {
    location: ownParams.location,
    children: state.children,
    user: state.auth.data.decoded,
  };
}

export default connect(select)(Children);
