import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { goBack, push } from 'react-router-redux';

import { LinearProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import { blueGrey } from 'material-ui/colors';

import PageHeader from '../components/PageHeader';
import ChildDetails from '../components/ChildDetails';
import FeedbackDetails from '../components/FeedbackDetails';
import FeedbackOverview from '../components/FeedbackOverview';
import rest from '../utils/rest';
import NotFound from './NotFound';

const mapStateToProps = state => ({
  child: state.child,
  childLoading: state.child.loading,
  employees: state.employees,
  feedbackDetail: state.feedbackDetail,
  feedback: state.feedback,
  moods: state.feedbackMoods,
});

const mapDispatchToProps = dispatch => ({
  refresh: childId => {
    dispatch(rest.actions.child.get({ childId: childId }));
  },
  update: (childId, data) => {
    dispatch(
      rest.actions.child.patch(
        { childId: childId },
        { body: JSON.stringify(data) },
      ),
    );
  },
  delete: childId => {
    dispatch(
      rest.actions.child.delete({ childId: childId }, () => {
        dispatch(push('/children'));
      }),
    );
  },
  getEmployees: () => {
    dispatch(rest.actions.employees());
  },
  deleteFeedback: (childId, feedbackId) => {
    dispatch(
      rest.actions.feedbackDetail.delete({ feedbackId: feedbackId }, () => {
        dispatch(push(`/children/${childId}`));
      }),
    );
  },
  updateFeedback: (feedbackId, data) => {
    dispatch(
      rest.actions.feedbackDetail.patch(
        { feedbackId: feedbackId },
        { body: JSON.stringify(data) },
      ),
    );
  },
  getFeedback: params => {
    dispatch(rest.actions.feedback(params));
  },
  getMoods: params => {
    dispatch(rest.actions.feedbackMoods(params));
  },
  openFeedback: (childId, feedbackId) => {
    const path = `/children/${childId}/feedback/${feedbackId}`;
    dispatch(push(path));
  },
  getFeedbackDetail: feedbackId => {
    dispatch(rest.actions.feedbackDetail.get({ feedbackId }));
  },
});

@injectIntl
class ChildWrapper extends React.Component {
  componentWillMount() {
    this.props.getEmployees();

    if (this.props.match.params.feedbackId) {
      this.props.getFeedbackDetail(this.props.match.params.feedbackId);
    }
  }

  componentWillReceiveProps(newProps) {
    const hasFeedbackId = newProps.match.params.feedbackId;
    const feedbackIdChanged =
      newProps.match.params.feedbackId !== this.props.match.params.feedbackId;

    if (hasFeedbackId && feedbackIdChanged) {
      this.props.getFeedbackDetail(this.props.match.params.feedbackId);
    }
  }

  componentDidMount() {
    const { refresh } = this.props;

    refresh(this.props.match.params.childId);
  }

  renderProgressBar() {
    const { childLoading } = this.props;

    return childLoading
      ? <div style={{ marginBottom: '-5px' }}>
          <LinearProgress />
        </div>
      : null;
  }

  renderChildDetails = () =>
    <Grid item xs={12} sm={6}>
      <ChildDetails
        child={this.props.child.data}
        employees={this.props.employees}
        onUpdate={this.props.update.bind(this)}
        onDelete={this.props.delete.bind(this)}
      />
    </Grid>;

  renderFeedbackOverview = () =>
    <Grid item xs={12} sm={6}>
      <FeedbackOverview
        childId={this.props.match.params.childId}
        activeFeedback={this.props.match.params.feedbackId}
        feedback={this.props.feedback}
        moods={this.props.moods}
        refreshMoods={this.props.getMoods}
        refreshFeedback={this.props.getFeedback}
        openFeedback={this.props.openFeedback}
      />
    </Grid>;

  renderFeedbackDetails = () => {
    const { intl: { formatMessage } } = this.props;
    return (
      <Grid item xs={12} sm={12}>
        {this.props.match.params.feedbackId
          ? <FeedbackDetails
              childId={this.props.child.data.id}
              details={this.props.feedbackDetail}
              employees={this.props.employees}
              onUpdate={this.props.updateFeedback.bind(this)}
              onDelete={this.props.deleteFeedback.bind(this)}
            />
          : <Grid
              item
              className="info"
              style={{
                background: blueGrey[50],
                border: `1px solid ${blueGrey[100]}`,
              }}
            >
              {formatMessage({ id: 'selectFeedback' })}
            </Grid>}
      </Grid>
    );
  };

  render() {
    const { child, childLoading } = this.props;

    return (
      <div>
        {childLoading
          ? this.renderProgressBar()
          : child.data && child.data.id
            ? <div className="child-profile">
                <PageHeader header={child.data.name} />

                <Grid container gutter={24}>
                  {this.renderChildDetails()}
                  {this.renderFeedbackOverview()}
                  {this.renderFeedbackDetails()}
                </Grid>
              </div>
            : <NotFound />}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChildWrapper);
