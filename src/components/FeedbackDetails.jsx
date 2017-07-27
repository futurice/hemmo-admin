import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { red } from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import { LabelSwitch } from 'material-ui/Switch';
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

  selectAssignee(event, assigneeId) {
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

  render() {
    const { details, employees, intl: { formatMessage } } = this.props;
    const data = details.data;
    const loading = details.loading;
    const indentAttachemnts = data.attachments && data.attachments.length > 1;
    const moodList = [
      { id: 0, name: formatMessage({ id: 'neutral' }) },
      { id: 1, name: formatMessage({ id: 'positive' }) },
      { id: -1, name: formatMessage({ id: 'negative' }) },
    ];
    const moodIndex = Object.keys(moodList).filter(i => {
      return moodList[i].id === data.givenMood;
    });

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
                        <LabelSwitch
                          checked={data.reviewed}
                          label={formatMessage({ id: 'reviewed' })}
                          onChange={this.toggleReviewStatus}
                        />
                      </div>
                      <div className="given-mood">
                        <Typography
                          type="subheading"
                          component="span"
                          className="given-mood"
                        >
                          {formatMessage({ id: 'givenMood' })}
                        </Typography>
                        <SelectMenu
                          id="given-mood"
                          selectedId={data.givenMood || ''}
                          loading={false}
                          data={moodList}
                          label={
                            moodIndex.length ? moodList[moodIndex].name : ''
                          }
                          onSelect={this.setGivenMood}
                        />
                      </div>
                      <div className="assignee">
                        <Typography
                          type="subheading"
                          component="span"
                          className="assignee"
                        >
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
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                      onClick={() => this.setState({ dialogOpen: true })}
                    >
                      {formatMessage({ id: 'deleteFeedback' })}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
              <CardContent>
                {data.moods && data.moods.length
                  ? <div>
                      <Divider />
                      <Grid container gutter={0} className="moods">
                        <Grid item>
                          <Typography type="subheading">
                            {formatMessage({ id: 'moods' })}
                          </Typography>
                          {data.moods.map((mood, i) =>
                            <span key={i} className="mood">
                              {mood}
                            </span>,
                          )}
                        </Grid>
                      </Grid>
                    </div>
                  : null}
                {data.activities && data.activities.length
                  ? <div>
                      <Divider />
                      <Grid container gutter={0} className="activities">
                        <Typography type="subheading">
                          {formatMessage({ id: 'activities' })}
                        </Typography>
                        <Grid item xs={12}>
                          {data.activities.map((act, i) => {
                            const classes = {
                              '1': 'positive',
                              '0': 'neutral',
                              '-1': 'negative',
                            };

                            const moodClass =
                              act.like !== undefined
                                ? classes[act.like.toString()]
                                : null;

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
                  : null}
                {data.attachments && data.attachments.length
                  ? <div>
                      <Divider />
                      <Grid container gutter={0} className="attachments">
                        <Typography type="subheading">
                          {formatMessage({ id: 'attachments' })}
                        </Typography>
                        <Grid item xs={12}>
                          {data.attachments.map((attachment, i) =>
                            <div
                              key={i}
                              className={indentAttachemnts ? 'indent' : null}
                            >
                              {indentAttachemnts
                                ? <Typography>
                                    {formatMessage({ id: 'attachment' })}{' '}
                                    {i + 1}
                                  </Typography>
                                : null}
                              <div>
                                <Attachment
                                  id={attachment.id}
                                  mime={attachment.mime}
                                />
                              </div>
                            </div>,
                          )}
                        </Grid>
                      </Grid>
                    </div>
                  : null}
              </CardContent>
            </Card>
          : <div style={{ textAlign: 'center' }}>
              <CircularProgress />
            </div>}

        <DeleteDialog
          handleDelete={this.handleDelete.bind(this)}
          handleClose={() => {
            this.setState({
              dialogOpen: false,
            });
          }}
          open={this.state.dialogOpen}
          message={formatMessage({ id: 'deleteFeedbackWarn' })}
        />
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
