import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux'
import { FormattedMessage, injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
//import { LinearProgress } from 'material-ui/Progress';
import ArrowForward from 'material-ui-icons/ArrowForward';
import Done from 'material-ui-icons/Done';
import { red300, lightGreen300 } from 'material-ui/styles/colors';
import AlertErrorOutline from 'material-ui-icons/ErrorOutline';

import TableCard from '../components/TableCard';
import PageHeader from '../components/PageHeader';

import rest from '../utils/rest';


@injectIntl
class Users extends React.Component {
  state = {
    page: 0,
    pageEntries: 20,
    showAll: false,
    name: '',
    orderBy: 'name',
    order: 'asc'
  }

  // Refresh user list when component is first mounted
  componentWillMount() {
    this.refresh();
  }

  refresh(p = {}) {
    const { dispatch } = this.props;
    const params = Object.assign(this.state, p);

    this.setState({...this.state, params});

    let queryParams = {
      offset: params.page * params.pageEntries,
      limit: params.pageEntries,
      showAll: params.showAll,
      name: params.name,
      orderBy: params.orderBy,
      order: params.order
    };

    dispatch(rest.actions.users(queryParams));
  }

  refreshUser(userId) {
    this.props.dispatch(push('/children/' + userId));
  }

  render() {
    const { users, intl: { formatMessage } } = this.props;
    const initialPage = 0;
    const pageEntries = 20;

    return (
      <div>
        <PageHeader header={formatMessage({id: 'Children'})} />
        <TableCard
          initialPage={ initialPage }
          pageEntries={ pageEntries }
          model={ users }
          emptyMsg={ this.props.noFeedbackMsg }
          orderBy={this.state.orderBy}
          order={this.state.order}
          header={[
            {
              id: null,
              value: row => row.reviewed ?
                <Done style={{ verticalAlign: 'middle' }} color={lightGreen300}/> :
                <AlertErrorOutline style={{ verticalAlign: 'middle' }} color={red300}/>,

              style: { width: '20px' },
              maxShowWidth: 320
            },
            {
              id: 'name',
              value: row => row.name,
              columnTitle: <FormattedMessage id='name' />
            },
            {
              id: 'assignee',
              value: row => row.assignee,
              columnTitle: <FormattedMessage id='assignee' />,
              defaultValue: '(nobody)',
              maxShowWidth: 680
            },
            {
              id: 'received',
              value: row => new Date(row.createdAt).toLocaleDateString(),
              columnTitle: <FormattedMessage id='lastFeedback' />,
              maxShowWidth: 440
            },
            {
              component: (
                <Button style={{
                  minWidth: '40px'
                }}><ArrowForward/></Button>
              ),

              style: { width: '20px' }
            }
          ]}
          onClickRow={this.refreshUser.bind(this)}
          refresh={this.refresh.bind(this)}
        />
      </div>
    );
  }
}

Users.propTypes = {
  users: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

function select(state, ownParams) {
  return {
    location: ownParams.location,
    users: state.users
  };
}

export default connect(select)(Users);