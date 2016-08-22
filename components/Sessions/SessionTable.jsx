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
import { red300, lightGreen300 } from 'material-ui/styles/colors';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';
import { push } from 'react-router-redux'
import Error from '../Error';
import ThumbUp from 'material-ui/svg-icons/social/sentiment-satisfied';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import Done from 'material-ui/svg-icons/action/done';
import AlertErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import Dimensions from '../dimensions'

import Account from 'material-ui/svg-icons/action/account-circle';
import TableCard from '../TableCard';

class SessionTable extends Component {
  constructor(props) {
    super(props);
  }

  refresh(pagination) {
    const {dispatch} = this.props;

    let params = {
      ...this.props.filter,
      offset: pagination.page * pagination.pageEntries,
      limit: pagination.pageEntries
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
    const spacing = this.context.muiTheme.spacing;

    return(
      <TableCard
        model={ this.props.extra ? this.props.sessionsExtra : this.props.sessions }
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
            columnTitle: 'Child'
          },
          {
            value: row => row.assignee,
            columnTitle: 'Assignee',
            defaultValue: '(nobody)',
            defaultValueStyle: { color: palette.accent3Color },
            maxShowWidth: 680
          },
          {
            value: row => new Date(row.createdAt).toLocaleDateString(),
            columnTitle: 'Feedback started',
            maxShowWidth: 440
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

function select(state) {
  return {
    sessions: state.sessions,
    sessionsExtra: state.sessionsExtra
  };
}

export default connect(select)(SessionTable);
