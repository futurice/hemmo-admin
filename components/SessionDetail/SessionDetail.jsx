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

import Attachment from './Attachment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {
  grey900,
  grey300,
  red300,
  red900,
  yellow300,
  lightGreen300,
  lightGreen500
} from 'material-ui/styles/colors';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import ActionDone from 'material-ui/svg-icons/action/done';
import Done from 'material-ui/svg-icons/action/done';
import Announcement from 'material-ui/svg-icons/alert/error-outline';
import Cancel from 'material-ui/svg-icons/navigation/cancel';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import ErrorOutline from 'material-ui/svg-icons/alert/error-outline';
import rest from '../../reducers/api';
import { withRouter } from 'react-router';
import { goBack } from 'react-router-redux';
import Error from '../Error';
import ThumbUp from 'material-ui/svg-icons/social/sentiment-satisfied';
import ThumbDown from 'material-ui/svg-icons/social/sentiment-dissatisfied';
import NA from 'material-ui/svg-icons/av/not-interested';
import Neutral from 'material-ui/svg-icons/social/sentiment-neutral';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Close from 'material-ui/svg-icons/navigation/close';
import AttachmentIcon from 'material-ui/svg-icons/file/attachment';
import config from 'config';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  chip: {
    margin: 4
  },
  chipWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  }
};

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

class SessionDetail extends Component {
  constructor(props) {
    super(props);

    // for toggles states
    this.state = {
      attachmentOpen: false,
      openAttachmentContentId: null
    };
    this.markReviewed = this.markReviewed.bind(this);
    this.setAssignee = this.setAssignee.bind(this);
  }

  handleClose = () => {
    this.setState({
      attachmentOpen: false,
      openAttachmentContentId: null});
  };

  refresh() {
    const {dispatch} = this.props;
    dispatch(rest.actions.sessionDetail({sessionId: this.props.id}));
    dispatch(rest.actions.employees());
  }

  componentDidMount() {
    this.refresh();
  }

  openAttachment(contentId) {
    this.setState({
      attachmentOpen: true,
      openAttachmentContentId: contentId
    });
  }

  markReviewed(reviewStatus) {
    const self = this;
    const callback = function() {
      self.refresh();
    };
    const {dispatch} = this.props;
    dispatch(rest.actions.sessionDetail.put({sessionId: this.props.id}, {
      body: JSON.stringify({
        reviewed: reviewStatus
      })
    }, callback));
  }

  setAssignee(event, index, value) {
    this.setState({
      assigneeId: value
    });

    this.props.dispatch(rest.actions.sessionDetail.put({sessionId: this.props.id}, {
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
    const { session } = this.props;

    if (session.loading) {
      return(
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      );
    } else if (!session.sync || !session.data || session.data.error) {
      return(
        <Error refresh={this.refresh} model={session}/>
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

      const palette = this.context.muiTheme.palette;
      const spacing = this.context.muiTheme.spacing;

      return(
        <div>
          <Card style={{
            margin: this.context.muiTheme.spacing.desktopGutter,
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

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: this.context.muiTheme.spacing.desktopGutter / 2
          }}>
          {session.data.content.map((content, index) => {
            let avgLikes = getLikeAvg(content.questions);

            return <Card key={index} style={{
              margin: this.context.muiTheme.spacing.desktopGutter / 2,
              flex: 1,
              flexBasis: '320px'
            }}>
              <CardHeader
                title={`Round ${index + 1}`}
                subtitle={avgLikes === null ? '' : `Mood: ${avgLikes > 0.5 ? 'Happy' : avgLikes < -0.5 ? 'Unhappy' : 'Neutral'}`}
                style={{
                  backgroundColor: avgLikes === null ? grey300 : (avgLikes > 0.5 ? lightGreen300 : avgLikes < -0.5 ? red300 : yellow300)
                }}
                avatar={((content) => {
                  if (avgLikes === null) {
                    return (<NA style={iconStyle}/>);
                  } else if (avgLikes > 0.5) {
                    return (<ThumbUp style={iconStyle}/>);
                  } else if (avgLikes === -0.5) {
                    return (<ThumbDown style={iconStyle}/>);
                  } else {
                    return (<Neutral style={iconStyle}/>);
                  }
                })(content)} />

              <CardText style={ styles.chipWrapper }>
                {content.moods ? content.moods.map((mood, index) => {
                  return <Chip style={ styles.chip } key={ index }>
                    { mood }
                  </Chip>;
                }) : null}
              </CardText>

              {content.questions ? content.questions.map((question, index) => {
                if (question.answer || question.attachmentId) {
                  return <CardTitle key={ index } subtitle={ question.question }>
                    <CardText>
                      {(() => {
                        if (question.attachmentId) {
                          return <FlatButton onTouchTap={(e) => {
                                this.openAttachment(question.attachmentId);
                              }} label="View attachment" icon={<AttachmentIcon/>} primary={true}/>
                        } else if (question.answer) {
                          return question.answer;
                        }
                      })()}
                    </CardText>
                  </CardTitle>;
                } else {
                  return null;
                }
              }) : null}

              <CardActions>
                {((content) => {
                  if (content.hasAttachment) {
                    return <FlatButton onTouchTap={(e) => {
                      this.openAttachment(content.contentId);
                    }} label="View attachment" icon={<AttachmentIcon/>} primary={true}/>;
                  } else {
                    return null;
                  }
                })(content)}
              </CardActions>
            </Card>
          })}
          </div>

          <Dialog
            title="Attachment"
            modal={false}
            open={this.state.attachmentOpen}
            onRequestClose={this.handleClose}
            actions={actions}
          >
            <Attachment contentId={this.state.openAttachmentContentId} />
          </Dialog>
        </div>
      );
    }
  }
}

SessionDetail.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

function select(state, ownProps) {
  return {
    session: state.sessionDetail,
    employees: state.employees,
    id: ownProps.params.id
  };
}

export default connect(select)(SessionDetail);
