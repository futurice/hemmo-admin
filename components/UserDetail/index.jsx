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

import { FormattedMessage } from 'react-intl';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SessionTable from '../Sessions/SessionTable';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {
  red300,
  yellow300,
  lightGreen300
} from 'material-ui/styles/colors';
import Warning from 'material-ui/svg-icons/alert/warning';
import ActionDone from 'material-ui/svg-icons/action/done';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';
import { withRouter } from 'react-router';
import { goBack } from 'react-router-redux';
import Error from '../Error';
import ThumbUp from 'material-ui/svg-icons/social/sentiment-satisfied';
import ThumbDown from 'material-ui/svg-icons/social/sentiment-dissatisfied';
import Neutral from 'material-ui/svg-icons/social/sentiment-neutral';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Close from 'material-ui/svg-icons/navigation/close';
import AttachmentIcon from 'material-ui/svg-icons/file/attachment';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// Components
import DeleteDialog from '../Shared/DeleteDialog';

class UserDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assigneeId: -1,
      dialogOpen: false
    };

    this.setAssignee = this.setAssignee.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  openDeleteDialog() {
    this.setState({dialogOpen: true});
  }

  handleDelete() {
    const {dispatch} = this.props;
    dispatch(rest.actions.userDetail.delete({id: this.props.userId}, () => {
      dispatch(goBack());
    }));
  }

  setAssignee(event, index, value) {
    this.setState({
      assigneeId: value
    });

    this.props.dispatch(rest.actions.userDetail.put({id: this.props.userId}, {
      body: JSON.stringify({
        assigneeId: value
      })
    }, (err) => {
      if (err) {
        console.log(err);
      }
    }));
  }

  refresh() {
    const {dispatch} = this.props;
    dispatch(rest.actions.userDetail({id: this.props.userId}));
    dispatch(rest.actions.employees());
  }

  componentDidMount() {
    this.refresh();
  }

  render() {
    const { user } = this.props;

    if (user.loading) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (!user.sync || !user.data || user.data.error) {
      return(
        <Error refresh={this.refresh} model={user}/>
      );
    } else {
      const actions = [
        <FlatButton
          label="Close"
          primary={false}
          onTouchTap={this.handleClose}
          icon={<Close/>}
        />
      ];

      const iconSize = '42px';
      const iconStyle = {
        height: iconSize,
        width: iconSize
      };

      const palette = this.context.muiTheme.palette;
      const spacing = this.context.muiTheme.spacing;

      let likes = user.data.likes;
      let percentAvg = Math.round((likes + 1) / 2 * 100);

      return(
        <div>
          <DeleteDialog
            handleDelete={this.handleDelete}
            handleClose={() => {
              this.setState({
                dialogOpen: false
              });
            }}
            open={this.state.dialogOpen}
            message={<FormattedMessage id='deleteUserWarn' />}/>
          <Card style={{
            margin: spacing.desktopGutter
          }}>
            <CardHeader
              title={user.data.name}
              subtitle={likes !== null ? <FormattedMessage id='percentHappy' values={{percent: percentAvg}} /> : `No feedback given`}
              style={{
                backgroundColor: likes > 0.5 || likes === null ? lightGreen300 : likes > -0.5 ? yellow300 : red300
              }}
              avatar={
                likes > 0.5 || likes === null ? <ThumbUp style={iconStyle}/> : likes > -0.5 ? <Neutral style={iconStyle}/> : <ThumbDown style={iconStyle}/>
              } >
            </CardHeader>

            <CardTitle subtitle={ <FormattedMessage id='assignee:' /> }>
              <CardText>
                <SelectField onChange={this.setAssignee} value={user.data.assignee ? user.data.assignee.id : null}>
                  <MenuItem key={'nobody'} value={null} style={{color: palette.accent3Color}} primaryText={<FormattedMessage id='nobody' />} />
                  {this.props.employees.data.map((row, index) => (
                    <MenuItem key={index} value={row.employeeId} primaryText={row.name} />
                  ))}
                </SelectField>

                <div style={{
                  color: palette.accent3Color
                }}>
                  <FormattedMessage id='assigneeExplanation' values={{ child: <b> {user.data.name} </b> }} />
                </div>
              </CardText>
            </CardTitle>

            <CardTitle subtitle={ <FormattedMessage id='registrationDate:' />}>
              <CardText>
                { new Date(user.data.createdAt).toLocaleDateString() }
              </CardText>
            </CardTitle>

            <CardTitle subtitle={ <FormattedMessage id='feedbackBy' values={{ child: <b> {user.data.name} </b> }} />} />
            <CardText>
              <SessionTable filter={{
                user: this.props.userId
              }}/>
            </CardText>

            <CardTitle subtitle={ <FormattedMessage id='deleteUser' values={{ child: <b> {user.data.name} </b> }} />} />
            <CardText>
              <FlatButton label={ <FormattedMessage id='deleteUserDesc' /> }
                          onTouchTap={() => {
                            this.openDeleteDialog()
                          }}
                          style={{color: red300}}
                          icon={<Warning/>} />
            </CardText>

            <CardActions>
              <FlatButton label="Back"
                onTouchTap={() => {
                  this.props.dispatch(goBack());
                }}
                icon={<ArrowBack/>} />
            </CardActions>
          </Card>
        </div>
      );
    }
  }
}

UserDetail.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

function select(state, ownProps) {
  return {
    user: state.userDetail,
    employees: state.employees,
    setAssigneeId: state.setAssigneeId,
    userId: ownProps.params.id
  };
}

export default connect(select)(UserDetail);
