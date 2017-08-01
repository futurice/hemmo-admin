import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import Alert from 'material-ui-icons/Warning';
import ArrowForward from 'material-ui-icons/ArrowForward';
import { orange } from 'material-ui/colors';

import TableCard from '../components/TableCard';
import PageHeader from '../components/PageHeader';
import SnoozeDialog from '../components/SnoozeDialog';

import rest from '../utils/rest';

const mapStateToProps = state => ({
  children: state.children,
  user: state.auth.data.decoded,
});

@injectIntl
class Children extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      pageEntries: 20,
      showAll: false,
      name1: '',
      name2: '',
      orderBy: 'name',
      order: 'asc',
      snoozeOpen: false,
      childId: null,
    };

    this.openSnoozeDialog = this.openSnoozeDialog.bind(this);
    this.refreshUser = this.refreshUser.bind(this);
    this.refresh = this.refresh.bind(this);
    this.snoozeAlerts = this.snoozeAlerts.bind(this);
  }

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

  refreshUser(row) {
    this.props.dispatch(push('/children/' + row.id));
  }

  openSnoozeDialog(event, childId) {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      snoozeOpen: true,
      childId: childId,
    });
  }

  snoozeAlerts(snooze) {
    if (snooze && snooze.length) {
      const { dispatch } = this.props;
      const payload = {
        showAlerts: snooze === 'forever' ? false : true,
      };

      if (snooze !== 'forever') {
        const date = new Date();
        date.setMonth(date.getMonth() + 3);
        payload.alertDismissedAt = date;
      }

      dispatch(
        rest.actions.child.patch(
          { childId: this.state.childId },
          { body: JSON.stringify(payload) },
        ),
      ).then(this.refresh);
    }

    this.setState({
      snoozeOpen: false,
      childId: null,
    });
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
                      ? <Alert
                          style={{ color: orange[600], cursor: 'pointer' }}
                          onClick={e => this.openSnoozeDialog(e, row.id)}
                        />
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
          onClickRow={this.refreshUser}
          refresh={this.refresh}
        />

        {this.state.snoozeOpen
          ? <SnoozeDialog
              open={this.state.snoozeOpen}
              handleRequestClose={this.snoozeAlerts}
              childId={this.state.childId}
            />
          : null}
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

export default connect(mapStateToProps)(Children);
