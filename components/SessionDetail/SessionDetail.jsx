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
import Neutral from 'material-ui/svg-icons/social/sentiment-neutral';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Close from 'material-ui/svg-icons/navigation/close';
import AttachmentIcon from 'material-ui/svg-icons/file/attachment';

class SessionDetail extends Component {
  constructor(props) {
    super(props);

    // for toggles states
    this.state = {
      attachmentOpen: false,
      openAttachmentContentId: null
    };
    this.markReviewed = this.markReviewed.bind(this);
  }

  handleClose = () => {
    this.setState({
      attachmentOpen: false,
      openAttachmentContentId: null});
  };

  refresh() {
    const {dispatch} = this.props;
    dispatch(rest.actions.sessionDetail({sessionId: this.props.id}));
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
    dispatch(rest.actions.sessionUpdate({sessionId: this.props.id}, {
      body: JSON.stringify({
        reviewed: reviewStatus
      })
    }, callback));
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

      if (session.data.content.length) {
        avgLikes = session.data.content.reduce((sum, content) => {
          return sum + content.like;
        }, 0) / session.data.content.length;
      }

      const iconSize = '42px';
      const iconStyle = {
        height: iconSize,
        width: iconSize
      };

      return(
        <div>
          <Card style={{
            margin: this.context.muiTheme.spacing.desktopGutter,
            marginBottom: 0
          }}>
            <CardHeader
              title={session.data.user.name}
              subtitle={avgLikes !== null ? `${Math.round((avgLikes + 1) / 2 * 100)}% happy in session` : null}
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
            <CardTitle subtitle={'Started'}>
              <CardText>
                {new Date(session.data.startedAt).toLocaleDateString()}
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
          {session.data.content.map((row, index) => (
            <Card key={index} style={{
              margin: this.context.muiTheme.spacing.desktopGutter / 2,
              flex: 1,
              flexBasis: '320px'
            }}>
              <CardHeader
                title={`Question ${index + 1}`}
                subtitle={`Mood: ${row.like === 1 ? 'Happy' : row.like === -1 ? 'Unhappy' : 'Neutral'}`}
                style={{
                  backgroundColor: row.like === 1 ? lightGreen300 : row.like === -1 ? red300 : yellow300
                }}
                avatar={((row) => {
                  if (row.like === 1) {
                    return (<ThumbUp style={iconStyle}/>);
                  } else if (row.like === -1) {
                    return (<ThumbDown style={iconStyle}/>);
                  } else {
                    return (<Neutral style={iconStyle}/>);
                  }
                })(row)} />
              <CardTitle title={ row.question }/>
              <CardTitle subtitle={'Answer'}>
                <CardText>
                  { row.answer }
                </CardText>
              </CardTitle>
              <CardActions>
                {((row) => {
                  if (row.hasAttachment) {
                    return <FlatButton onTouchTap={(e) => {
                      this.openAttachment(row.contentId);
                    }} label="View attachment" icon={<AttachmentIcon/>} primary={true}/>;
                  } else {
                    return null;
                  }
                })(row)}
              </CardActions>
            </Card>
          ))}
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
    id: ownProps.params.id
  };
}

export default connect(select)(SessionDetail);
