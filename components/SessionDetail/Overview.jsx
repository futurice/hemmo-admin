/*
 * React & Redux
 */
import { Component, PropTypes } from 'react';
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

// Colors
import {
  red300,
  yellow300,
  lightGreen300
} from 'material-ui/styles/colors';

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

    this.markReviewed = this.markReviewed.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
  }

  markReviewed(reviewStatus) {
    const {dispatch} = this.props;
    dispatch(rest.actions.sessionDetail.put({id: this.props.id}, {
      body: JSON.stringify({
        reviewed: reviewStatus
      })
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
      <Card style={{
        margin: spacing.desktopGutter,
        marginBottom: 0
      }}>
        <CardHeader
          title={session.data.user.name}
          subtitle={avgLikes !== null ? `${Math.round((avgLikes + 1) / 2 * 100)}% happy in session` : `No feedback given yet`}
          style={{
            backgroundColor: avgLikes > 0.5 ? lightGreen300 : avgLikes > -0.5 ? yellow300 : red300
          }}
          avatar={
            avgLikes > 0.5 ? <ThumbUp style={iconStyle}/> : avgLikes > -0.5 ? <Neutral style={iconStyle}/> : <ThumbDown style={iconStyle}/>
          } />

        <CardTitle subtitle={'Review status'}>
          <CardText> {
            session.data.reviewed ?
              <Chip>
                <Avatar backgroundColor={lightGreen300} icon={<Done />} />
                Reviewed
              </Chip>
              :
              <Chip>
                <Avatar backgroundColor={red300} icon={<Announcement />} />
                Unhandled
              </Chip>
            }
          </CardText>
        </CardTitle>

        <CardTitle subtitle={'Assignee:'}>
          <CardText>
            <SelectField onChange={this.setAssignee} value={session.data.assigneeId}>
              <MenuItem key={'nobody'} value={null} style={{color: palette.accent3Color}} primaryText={'(nobody)'} />
              {this.props.employees.data.map((row, index) => (
                <MenuItem key={index} value={row.employeeId} primaryText={row.name} />
              ))}
            </SelectField>
          </CardText>
        </CardTitle>

        <CardTitle subtitle={'Started'}>
          <CardText>
            {new Date(session.data.createdAt).toLocaleDateString()}
          </CardText>
        </CardTitle>
        {session.reviewed ?
          null :
          <CardActions>
            <FlatButton label="Back"
                        onTouchTap={() => {
                          this.props.dispatch(goBack());
                        }}
                        icon={<ArrowBack/>} />
            <FlatButton label={session.data.reviewed ?  'Mark unhandled' : 'Mark reviewed'}
                        onTouchTap={() => {
                          this.markReviewed(!session.data.reviewed)
                        }}
                        primary={!session.data.reviewed}
                        icon={session.data.reviewed ? <Cancel/> : <ActionDone/>} />
          </CardActions>
        }
      </Card>
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
