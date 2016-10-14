import { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';
import { push } from 'react-router-redux'
import Error from '../Error';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import Account from 'material-ui/svg-icons/action/account-circle';

import TableCard from '../TableCard';

class UserTable extends Component {
  constructor(props) {
    super(props);
  }

  refresh(pagination) {
    const {dispatch} = this.props;

    dispatch(rest.actions.users({
      offset: pagination.page * pagination.pageEntries,
      limit: pagination.pageEntries
    }));
  }

  openUser(userId) {
    const path = '/users/' + userId;
    this.props.dispatch(push(path));
  }

  render() {
    const palette = this.context.muiTheme.palette;
    const spacing = this.context.muiTheme.spacing;

    return <TableCard
      model={this.props.users}
      header={[
        {
          component: <Account style={{ verticalAlign: 'middle' }}/>,
          style: { width: '20px' }
        },
        {
          value: row => row.name,
          columnTitle: <FormattedMessage id='name' />
        },
        {
          value: row => new Date(row.createdAt).toLocaleDateString(),
          columnTitle: <FormattedMessage id='registrationDate' />,
          maxShowWidth: 440
        },
        {
          value: row => row.assignee,
          columnTitle: <FormattedMessage id='assignee' />,
          defaultValue: <FormattedMessage id='nobody' />,
          defaultValueStyle: { color: palette.accent3Color },
          maxShowWidth: 640
        },
        {
          component: (
            <FlatButton style={{
              minWidth: '40px'
            }} icon={<ArrowForward/>} />
          ),
          style: { width: '20px' }
        }
      ]}
      onClickRow={this.openUser.bind(this)}
      refresh={this.refresh.bind(this)}
    />;
  }
}

UserTable.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

UserTable.propTypes = {
  users: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      entries: PropTypes.array.isRequired,
      totalEntries: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

function select(state) {
  return { users: state.users };
}

export default connect(select)(UserTable);
