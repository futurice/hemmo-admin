import { Component, PropTypes } from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {red500} from 'material-ui/styles/colors';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';
import { push } from 'react-router-redux'
import Error from '../Error';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import Account from 'material-ui/svg-icons/action/account-circle';
import Dimensions from '../dimensions'

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

  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled
    });
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
          field: 'name',
          columnTitle: 'Name'
        },
        {
          field: 'assignee',
          columnTitle: 'Assignee',
          defaultValue: '(nobody)',
          defaultValueStyle: { color: palette.accent3Color },
          maxShowWidth: 640
        },
        {
          maxShowWidth: 640,
          component: (
            <FlatButton onTouchTap={(e) => {
              console.log(e);
              //this.openUser.bind(this);
            }} style={{
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

export default connect(select)(Dimensions()(UserTable));
