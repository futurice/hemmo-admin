import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { red } from 'material-ui/colors';
import Divider from 'material-ui/Divider';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import { CircularProgress } from 'material-ui/Progress';

import DeleteDialog from '../components/DeleteDialog';
import SelectMenu from '../components/SelectMenu';
import Attachment from '../components/Attachment';

@injectIntl
export default class FeedbackDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false,
    };

    this.selectAssignee = this.selectAssignee.bind(this);
    this.toggleReviewStatus = this.toggleReviewStatus.bind(this);
    this.setGivenMood = this.setGivenMood.bind(this);
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString(navigator.languages, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  handleDelete() {
    this.props.onDelete(this.props.childId, this.props.details.data.id);
  }

  selectAssignee(assigneeId) {
    this.props.onUpdate(this.props.details.data.id, {
      assigneeId: assigneeId,
    });
  }

  toggleReviewStatus() {
    this.props.onUpdate(this.props.details.data.id, {
      reviewed: !this.props.details.data.reviewed,
    });
  }

  setGivenMood(mood) {
    this.props.onUpdate(this.props.details.data.id, {
      givenMood: mood,
    });
  }

  renderAttachments = () => {
    const { attachments } = this.props.details.data;
    const { intl: { formatMessage } } = this.props;
    const indentAttachments = attachments && attachments.length > 1;

    return attachments && attachments.length
      ? <div>
          <Divider />
          <Grid container gutter={0} className="attachments">
            <Typography type="subheading">
              {formatMessage({ id: 'attachments' })}
            </Typography>
            <Grid item xs={12}>
              {attachments.map((attachment, i) =>
                <div key={i} className={indentAttachments ? 'indent' : null}>
                  {indentAttachments
                    ? <Typography>
                        {formatMessage({ id: 'attachment' })} {i + 1}
                      </Typography>
                    : null}
                  <div>
                    <Attachment id={attachment.id} mime={attachment.mime} />
                  </div>
                </div>,
              )}
            </Grid>
          </Grid>
        </div>
      : null;
  };

  renderActivities = () => {
    const { activities } = this.props.details.data;
    const { intl: { formatMessage } } = this.props;
    const classes = {
      '1': 'positive',
      '0': 'neutral',
      '-1': 'negative',
    };

    return activities && activities.length
      ? <div>
          <Divider />
          <Grid container gutter={0} className="activities">
            <Typography type="subheading">
              {formatMessage({ id: 'activities' })}
            </Typography>
            <Grid item xs={12}>
              {activities.map((act, i) => {
                const moodClass =
                  act.like !== undefined ? classes[act.like.toString()] : null;

                return (
                  <Card key={i} className={'activity ' + moodClass}>
                    <CardContent>
                      <Typography type="subheading">
                        {act.main}, {act.sub}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Grid>
          </Grid>
        </div>
      : null;
  };

  renderMoods = () => {
    const { moods } = this.props.details.data;
    const { intl: { formatMessage } } = this.props;

    return moods && moods.length
      ? <div>
          <Divider />
          <Grid container gutter={0} className="moods">
            <Grid item>
              <Typography type="subheading">
                {formatMessage({ id: 'moods' })}
              </Typography>
              {moods.map((mood, i) =>
                <span key={i} className="mood">
                  {mood}
                </span>,
              )}
            </Grid>
          </Grid>
        </div>
      : null;
  };

  renderAssignee = () => {
    const { data } = this.props.details;
    const { employees } = this.props;
    const { intl: { formatMessage } } = this.props;

    return (
      <div className="assignee">
        <Typography type="subheading" component="span" className="assignee">
          {formatMessage({ id: 'assignee' })}
        </Typography>
        <SelectMenu
          id="assignee-feedback"
          selectedId={data.assigneeId || ''}
          loading={employees.loading}
          data={employees.data.entries}
          label={data.assigneeName || ''}
          onSelect={this.selectAssignee}
        />
      </div>
    );
  };

  renderGivenMood = () => {
    const { data } = this.props.details;
    const { intl: { formatMessage } } = this.props;
    const moodList = [
      { id: 0, name: formatMessage({ id: 'neutral' }) },
      { id: 1, name: formatMessage({ id: 'positive' }) },
      { id: -1, name: formatMessage({ id: 'negative' }) },
    ];
    const moodIndex = Object.keys(moodList).filter(i => {
      return moodList[i].id === data.givenMood;
    });

    return (
      <div className="given-mood">
        <Typography type="subheading" component="span" className="given-mood">
          {formatMessage({ id: 'givenMood' })}
        </Typography>
        <SelectMenu
          id="given-mood"
          selectedId={data.givenMood || ''}
          loading={false}
          data={moodList}
          label={moodIndex.length ? moodList[moodIndex].name : ''}
          onSelect={this.setGivenMood}
        />
      </div>
    );
  };

  renderConfirmDelete = () => {
    const { intl: { formatMessage } } = this.props;

    return this.state.dialogOpen
      ? <DeleteDialog
          handleDelete={this.handleDelete.bind(this)}
          handleClose={() => {
            this.setState({
              dialogOpen: false,
            });
          }}
          open={this.state.dialogOpen}
          message={formatMessage({ id: 'deleteFeedbackWarn' })}
        />
      : null;
  };

  render() {
    const { details, intl: { formatMessage } } = this.props;
    const data = details.data;
    const loading = details.loading;

    return (
      <div className="feedback-details">
        {!loading
          ? <Card>
              <CardContent style={{ paddingBottom: 0 }}>
                <Typography type="headline">
                  {formatMessage({ id: 'feedback' })}
                </Typography>
                <Grid container gutter={0}>
                  <Grid item xs={12} sm={8}>
                    <Typography type="subheading" className="subheading">
                      <div>
                        {formatMessage({ id: 'date' })}:{' '}
                        {this.formatDate(data.createdAt)}
                      </div>
                      <div>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={data.reviewed}
                              onChange={this.toggleReviewStatus}
                            />
                          }
                          label={formatMessage({ id: 'reviewed' })}
                        />
                      </div>
                      {this.renderGivenMood()}
                      {this.renderAssignee()}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    style={{ textAlign: 'right', alignSelf: 'flex-start' }}
                  >
                    <Button
                      color="accent"
                      style={{
                        color: red[300],
                      }}
                      onClick={() => this.setState({ dialogOpen: true })}
                    >
                      {formatMessage({ id: 'deleteFeedback' })}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
              <CardContent>
                {this.renderMoods()}
                {this.renderActivities()}
                {this.renderAttachments()}
              </CardContent>
            </Card>
          : <div style={{ textAlign: 'center' }}>
              <CircularProgress />
            </div>}

        {this.renderConfirmDelete()}
      </div>
    );
  }
}

FeedbackDetails.propTypes = {
  childId: PropTypes.string.isRequired,
  details: PropTypes.object.isRequired,
  employees: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
