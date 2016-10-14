/*
 * React & Redux
 */
import { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

/*
 * MaterialUI
 */
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';

// Icons
import ThumbUp from 'material-ui/svg-icons/social/sentiment-satisfied';
import ThumbDown from 'material-ui/svg-icons/social/sentiment-dissatisfied';
import Neutral from 'material-ui/svg-icons/social/sentiment-neutral';
import NA from 'material-ui/svg-icons/av/not-interested';
import AttachmentIcon from 'material-ui/svg-icons/file/attachment';

// Colors
import {
  red300,
  yellow300,
  lightGreen300,
  grey300
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

const iconSize = '42px';
const styles = {
  chip: {
    margin: 4
  },
  chipWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  iconStyle: {
    height: iconSize,
    width: iconSize
  }
};

class SessionContents extends Component {
  render() {

    const spacing = this.context.muiTheme.spacing;

    let contents = this.props.contents.map((content, index) => {
      let avgLikes = getLikeAvg(content.questions);

      return (
        <Card key={`card ${index}`} style={{
          margin: spacing.desktopGutter / 2,
          flex: 1,
          flexBasis: '320px'
        }}>
          <CardHeader
            title={<FormattedMessage id='feedbackRound' values={{round: index + 1}} />}
            subtitle={avgLikes === null ? '' :
              avgLikes > 0.5 ? <FormattedMessage id='feedbackHappyMood' /> :
              avgLikes < -0.5 ? <FormattedMessage id='feedbackUnhappyMood' /> :
                                <FormattedMessage id='feedbackNeutralMood' />}
            style={{
              backgroundColor: avgLikes === null ? grey300 : (avgLikes > 0.5 ? lightGreen300 : avgLikes < -0.5 ? red300 : yellow300)
            }}
            avatar={((content) => {
              if (avgLikes === null) {
                return (<NA style={styles.iconStyle}/>);
              } else if (avgLikes > 0.5) {
                return (<ThumbUp style={styles.iconStyle}/>);
              } else if (avgLikes === -0.5) {
                return (<ThumbDown style={styles.iconStyle}/>);
              } else {
                return (<Neutral style={styles.iconStyle}/>);
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
                        this.props.openAttachment(question.attachmentId);
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
                  this.props.openAttachment(content.contentId);
                }} label="View attachment" icon={<AttachmentIcon/>} primary={true}/>;
              } else {
                return null;
              }
            })(content)}
          </CardActions>
        </Card>
      );
    });

    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: spacing.desktopGutter / 2
      }}>
        { contents }
      </div>
    );
  }
}

SessionContents.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

SessionContents.propTypes = {
  contents: PropTypes.array.isRequired,
  openAttachment: PropTypes.func.isRequired
};

export default SessionContents;
