import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import { red300, lightGreen300 } from 'material-ui/styles/colors';
import rest from '../utils/rest';
import { push } from 'react-router-redux'

import ArrowForward from 'material-ui-icons/ArrowForward';
import Done from 'material-ui-icons/Done';
import AlertErrorOutline from 'material-ui-icons/ErrorOutline';

import { FormattedMessage } from 'react-intl';

import TableCard from '../components/TableCard';

class SessionTable extends React.Component {
  refresh(pagination = {
      page: 0,
      pageEntries: 20
    }) {
    const {dispatch} = this.props;

    if (this.props.location && this.props.location.pathname === '/sessions') {
      this.props.dispatch(push({
        pathname: this.props.location.pathname,
        query: {
          page: pagination.page,
          pageEntries: pagination.pageEntries
        }
      }));
    }

    let params = {
      ...this.props.filter,
      offset: pagination.page * pagination.pageEntries,
      limit: pagination.pageEntries,
      order: 'asc'
    };

    if (this.props.extra) {
      dispatch(rest.actions.sessionsExtra(params));
    } else {
      dispatch(rest.actions.sessions(params));
    }
  }

  openSession(id) {
    const path = '/sessions/' + id;
    this.props.dispatch(push(path));
  }

  render() {
    const palette = this.context.muiTheme.palette;

    const initialPage = this.props.location ? this.props.location.query.page : 0;
    const pageEntries = this.props.location ? this.props.location.query.pageEntries : 20;

    return(
      <TableCard
        initialPage={ initialPage }
        pageEntries={ pageEntries }
        model={ this.props.extra ? this.props.sessionsExtra : this.props.sessions }
        emptyMsg={ this.props.noFeedbackMsg }
        header={[
          {
            value: row => row.reviewed ?
              <Done style={{ verticalAlign: 'middle' }} color={lightGreen300}/> :
              <AlertErrorOutline style={{ verticalAlign: 'middle' }} color={red300}/>,

            style: { width: '20px' },
            maxShowWidth: 320
          },
          {
            value: row => row.user.name,
            columnTitle: <FormattedMessage id='child' />
          },
          {
            value: row => row.assignee,
            columnTitle: <FormattedMessage id='assignee' />,
            defaultValue: '(nobody)',
            defaultValueStyle: { color: palette.accent3Color },
            maxShowWidth: 680
          },
          {
            value: row => new Date(row.createdAt).toLocaleDateString(),
            columnTitle: <FormattedMessage id='feedbackStartDate' />,
            maxShowWidth: 440
          },
          {
            component: (
              <Button style={{
                minWidth: '40px'
              }} icon={<ArrowForward/>} />
            ),

            style: { width: '20px' }
          }
        ]}
        onClickRow={this.openSession.bind(this)}
        refresh={this.refresh.bind(this)}
        small={this.props.small}
      />
    );
  }
}

SessionTable.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

SessionTable.propTypes = {
  sessions: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

function select(state, ownParams) {
  return {
    location: ownParams.location,
    sessions: state.sessions,
    sessionsExtra: state.sessionsExtra
  };
}

export default connect(select)(SessionTable);
