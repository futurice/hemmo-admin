/*
 * React & Redux
 */
import { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import rest from '../../reducers/api';

/*
 * MaterialUI
 */
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

// Icons
import Done from 'material-ui/svg-icons/action/done';
import ThumbUp from 'material-ui/svg-icons/social/sentiment-satisfied';
import ThumbDown from 'material-ui/svg-icons/social/sentiment-dissatisfied';
import Neutral from 'material-ui/svg-icons/social/sentiment-neutral';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Cancel from 'material-ui/svg-icons/navigation/cancel';
import Announcement from 'material-ui/svg-icons/alert/error-outline';
import ActionDone from 'material-ui/svg-icons/action/done';
import Warning from 'material-ui/svg-icons/alert/warning';

// Colors
import {
  red300,
  yellow300,
  lightGreen300
} from 'material-ui/styles/colors';

// Components
import DeleteDialog from '../Shared/DeleteDialog';

const getLikeAvg = questions => {
  let numLikes = 0;
  let sum = 0;

  questions.forEach(question => {
    if (question.like !== undefined) {
      numLikes++;
      sum += question.like;
    }
  });

  return numLikes >= 1 ? sum / numLikes : null;
};

class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false
    };

    this.markReviewed = this.markReviewed.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  markReviewed(reviewStatus) {
    const {dispatch} = this.props;
    dispatch(rest.actions.sessionDetail.put({id: this.props.id}, {
      body: JSON.stringify({
        reviewed: reviewStatus
      })
    }));
  }

  openDeleteDialog() {
    this.setState({dialogOpen: true});
  }

  handleDelete() {
    const {dispatch} = this.props;
    dispatch(rest.actions.sessionDetail.delete({id: this.props.id}, () => {
      dispatch(goBack());
    }));
  }

  setAssignee(event, index, value) {
    this.setState({
      assigneeId: value
    });

    this.props.dispatch(rest.actions.sessionDetail.put({id: this.props.id}, {
      body: JSON.stringify({
        assigneeId: value
      })
    }, (err) => {
      if (err) {
        console.log(err);
      }
    }));
  }

  render() {
    const palette = this.context.muiTheme.palette;
    const spacing = this.context.muiTheme.spacing;

    const session = this.props.session;

    let avgLikes = null;
    let numLikes = 0;

    if (session.data.content.length) {
      avgLikes = session.data.content.reduce((sum, content) => {
        let avg = getLikeAvg(content.questions);

        if (avg === null) {
          return sum;
        } else {
          numLikes++;
          return sum + avg;
        }
      }, 0);

      if (numLikes) {
        avgLikes /= numLikes;
      } else {
        avgLikes = null;
      }
    }

    const iconSize = '42px';
    const iconStyle = {
      height: iconSize,
      width: iconSize
    };

    return (
      <div>
        <DeleteDialog
          handleDelete={this.handleDelete}
          handleClose={() => {
            this.setState({
              dialogOpen: false
            });
          }}
          open={this.state.dialogOpen}
          message={<FormattedMessage id='deleteFeedbackWarn' />} />
        <Card style={{
          margin: spacing.desktopGutter,
          marginBottom: 0
        }}>
          <CardHeader
            title={session.data.user.name}
            subtitle={avgLikes !== null ? <FormattedMessage id='percentHappyInSession' values={{
              percent: Math.round((avgLikes + 1) / 2 * 100)
            }} /> : <FormattedMessage id='noFeedbackGiven' />}
            style={{
              backgroundColor: avgLikes > 0.5 ? lightGreen300 : avgLikes > -0.5 ? yellow300 : red300
            }}
            avatar={
              avgLikes > 0.5 ? <ThumbUp style={iconStyle}/> : avgLikes > -0.5 ? <Neutral style={iconStyle}/> : <ThumbDown style={iconStyle}/>
            } />

          <CardTitle subtitle={<FormattedMessage id='reviewStatus' />}>
            <CardText> {
              session.data.reviewed ?
                <Chip>
                  <Avatar backgroundColor={lightGreen300} icon={<Done />} />
                  <FormattedMessage id='reviewed' />
                </Chip>
                :
                <Chip>
                  <Avatar backgroundColor={red300} icon={<Announcement />} />
                  <FormattedMessage id='notReviewed' />
                </Chip>
              }
            </CardText>
          </CardTitle>

          <CardTitle subtitle={<FormattedMessage id='assignee:' />}>
            <CardText>
              <SelectField onChange={this.setAssignee} value={session.data.assigneeId}>
                <MenuItem key={'nobody'} value={null} style={{color: palette.accent3Color}} primaryText={<FormattedMessage id='nobody' />} />
                {this.props.employees.data.map((row, index) => (
                  <MenuItem key={index} value={row.employeeId} primaryText={row.name} />
                ))}
              </SelectField>
            </CardText>
          </CardTitle>

          <CardTitle subtitle={<FormattedMessage id='feedbackStartDate' />}>
            <CardText>
              {new Date(session.data.createdAt).toLocaleDateString()}
            </CardText>
          </CardTitle>
          {session.reviewed ?
            null :
            <CardActions>
              <FlatButton label={<FormattedMessage id='back' />}
                          onTouchTap={() => {
                            this.props.dispatch(goBack());
                          }}
                          icon={<ArrowBack/>} />
              <FlatButton label={session.data.reviewed ?  <FormattedMessage id='markUnhandled' /> : <FormattedMessage id='markReviewed' />}
                          onTouchTap={() => {
                            this.markReviewed(!session.data.reviewed)
                          }}
                          primary={!session.data.reviewed}
                          icon={session.data.reviewed ? <Cancel/> : <ActionDone/>} />
              <FlatButton label={<FormattedMessage id='deleteFeedback' />}
                          onTouchTap={() => {
                            this.openDeleteDialog()
                          }}
                          style={{color: red300}}
                          icon={<Warning/>} />
            </CardActions>
          }
        </Card>
      </div>
    );
  }
}

Overview.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

Overview.propTypes = {
  session: PropTypes.shape({
    data: PropTypes.shape({
      content: PropTypes.array.isRequired
    }).isRequired
  }).isRequired,
  employees: PropTypes.shape({
    data: PropTypes.array.isRequired
  }).isRequired,
  id: PropTypes.string.isRequired
};

export default connect()(Overview);
