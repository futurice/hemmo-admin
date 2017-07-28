import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { red, lightGreen } from 'material-ui/colors';
import ArrowForward from 'material-ui-icons/ArrowForward';
import Done from 'material-ui-icons/Done';
import AlertErrorOutline from 'material-ui-icons/ErrorOutline';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MoreVert from 'material-ui-icons/MoreVert';
import Menu, { MenuItem } from 'material-ui/Menu';
import MobileStepper from 'material-ui/MobileStepper';

import TableCard from '../components/TableCard';

@injectIntl
export default class FeedbackOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      orderBy: 'createdAt',
      order: 'desc',
      open: false,
      type: 'list',
      anchorEl: undefined,
    };

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.openFeedback = this.openFeedback.bind(this);
  }

  componentWillMount() {
    this.refreshFeedback();
    this.refreshMoods();
  }

  refreshFeedback(p = {}) {
    const params = Object.assign(this.state, p);

    this.setState(params);

    let queryParams = {
      offset: params.page * 3,
      limit: 3,
      childId: this.props.childId,
      orderBy: params.orderBy,
      order: params.order,
    };

    this.props.refreshFeedback(queryParams);
  }

  refreshMoods(p = {}) {
    const params = Object.assign(this.state, p);

    this.setState(params);

    let queryParams = {
      offset: params.page * 10,
      limit: 10,
      childId: this.props.childId,
      orderBy: params.orderBy,
      order: params.order,
    };

    this.props.refreshMoods(queryParams);
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString(navigator.languages, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  openFeedback(row) {
    this.props.openFeedback(this.props.childId, row.id);
  }

  openMenu(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  closeMenu(event, type) {
    this.setState({
      open: false,
      type: type || 'list',
    });
  }

  handleNext() {
    this.refresh({
      page: this.state.page + 1,
    });
  }

  handleBack() {
    this.refresh({
      page: this.state.age - 1,
    });
  }

  renderShortFeedbackList = () => {
    const { intl: { formatMessage } } = this.props;
    const pageCount =
      Math.floor(this.props.feedback.data.meta.count / this.state.pageEntries) -
      1;

    return (
      <div>
        <TableCard
          initialPage={this.state.page}
          pageEntries={this.state.pageEntries}
          model={this.props.feedback}
          emptyMsg={this.props.noFeedbackMsg}
          orderBy={this.state.orderBy}
          order={this.state.order}
          hideElems={['name1', 'name2', 'showAll']}
          hideToolbar={true}
          header={[
            {
              id: null,
              value: row =>
                row.reviewed
                  ? <Done color={lightGreen[300]} />
                  : <AlertErrorOutline color={red[300]} />,

              className: 'row-icon',
              maxShowWidth: 320,
              disablePadding: true,
            },
            {
              id: 'createdAt',
              value: row =>
                new Date(
                  row.createdAt,
                ).toLocaleDateString(navigator.languages, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }),
              columnTitle: formatMessage({ id: 'feedbackStartDate' }),
              className: 'date',
              maxShowWidth: 440,
            },
            {
              component: (
                <Button>
                  <ArrowForward />
                </Button>
              ),
              className: 'row-action',
            },
          ]}
          onClickRow={this.openFeedback.bind(this)}
          refresh={this.refreshFeedback.bind(this)}
        />
        {pageCount > 0
          ? <MobileStepper
              type="progress"
              steps={pageCount}
              position="static"
              activeStep={this.state.page}
              onBack={this.handleBack}
              onNext={this.handleNext}
              disableBack={this.state.page === 0}
              disableNext={this.state.page === pageCount}
            />
          : null}
      </div>
    );
  };

  renderHeadline = () => {
    const { intl: { formatMessage } } = this.props;
    const trendVisible = this.state.type === 'trend';
    const headlineText = !trendVisible ? 'feedbackList' : 'givenMoods';

    return (
      <div>
        <Typography type="headline" className="headline">
          <IconButton
            className="more"
            aria-owns="feedback-list-type"
            aria-haspopup="true"
            onClick={this.openMenu}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="feedback-list-type"
            anchorEl={this.state.anchorEl}
            open={this.state.open}
            onRequestClose={this.closeMenu}
          >
            <MenuItem
              value="list"
              onClick={event => this.closeMenu(event, 'list')}
            >
              {formatMessage({ id: 'feedbackList' })}
            </MenuItem>
            <MenuItem
              value="trend"
              onClick={event => this.closeMenu(event, 'trend')}
            >
              {formatMessage({ id: 'givenMoods' })}
            </MenuItem>
          </Menu>
          {formatMessage({ id: headlineText })}
        </Typography>
        {trendVisible
          ? <Typography className="sub">
              {formatMessage({ id: 'givenMoodsExplain' })}
            </Typography>
          : null}
      </div>
    );
  };

  renderMoodChart = () => {
    const moodCount = this.props.moods.data.entries.length + 1;

    return (
      <div className="feedback-trend">
        <div className="axis" />
        {this.props.moods.data.entries.map((mood, i) => {
          const positive = mood.givenMood === 1 ? 'positive' : null;
          const neutral = mood.givenMood === 0 ? 'neutral' : null;
          const negative = mood.givenMood === -1 ? 'negative' : null;
          const pos = Math.round(100 / moodCount) * (i + 1);

          return (
            <div
              key={i}
              style={{ left: `${pos}%` }}
              className={
                'mood ' +
                [positive, neutral, negative].join(' ') +
                (this.props.activeFeedback === mood.id ? ' active' : '')
              }
              onClick={() => this.openFeedback(mood)}
            >
              <span>
                {this.formatDate(mood.createdAt)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div className="feedback-overview">
        <Card>
          <CardContent>
            {this.renderHeadline()}

            {this.state.type === 'list'
              ? this.renderShortFeedbackList()
              : this.renderMoodChart()}
          </CardContent>
        </Card>
      </div>
    );
  }
}

FeedbackOverview.propTypes = {
  childId: PropTypes.string.isRequired,
  activeFeedback: PropTypes.string,
  feedback: PropTypes.object.isRequired,
  moods: PropTypes.object.isRequired,
  refreshFeedback: PropTypes.func.isRequired,
  refreshMoods: PropTypes.func.isRequired,
};
