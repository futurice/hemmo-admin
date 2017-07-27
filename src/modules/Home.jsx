import React from 'react';

import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { red, lightGreen, grey } from 'material-ui/styles/colors';
import ArrowForward from 'material-ui-icons/ArrowForward';
import Done from 'material-ui-icons/Done';
import AlertErrorOutline from 'material-ui-icons/ErrorOutline';
import Button from 'material-ui/Button';

import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import rest from '../utils/rest';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

import PageHeader from '../components/PageHeader';
import ModelTable from '../components/ModelTable';

const mapStateToProps = state => ({
  feedback: state.feedback,
  children: state.children,
  user: state.auth.data.decoded,
});

const mapDispatchToProps = dispatch => ({
  getFeedback: params => {
    dispatch(rest.actions.feedback(params));
  },
  getChildren: params => {
    dispatch(rest.actions.children({ ...params, orderBy: 'alert', alert: 1 }));
  },
  changeView(view) {
    dispatch(push(view.toLowerCase()));
  },
});

@injectIntl
@withRouter
class Home extends React.Component {
  state = {
    assigneeId: this.props.user.id,
    orderBy: 'createdAt',
    order: 'desc',
    offset: 0,
    limit: 20,
  };

  componentDidMount() {
    this.props.getFeedback(this.state);
    this.props.getChildren(this.state);
  }

  generateTable(data, onClickRow) {
    const reviewed = <Done color={lightGreen[300]} />;
    const notReviewed = <AlertErrorOutline color={red[300]} />;

    const header = [
      {
        id: null,
        value: row => (row.reviewed ? reviewed : notReviewed),

        className: 'row-icon',
        maxShowWidth: 320,
        disablePadding: true,
      },
      {
        id: 'name',
        value: row => row.childName || row.name,
        columnTitle: <FormattedMessage id="child" />,
      },
      {
        id: 'createdAt',
        value: row =>
          new Date(row.createdAt).toLocaleDateString(navigator.languages, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
        columnTitle: <FormattedMessage id="feedbackStartDate" />,
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
    ];

    return (
      <ModelTable
        order={this.state.order}
        orderBy={this.state.orderBy}
        header={header}
        entries={data.data.entries}
        onClickRow={onClickRow}
        tableSort={false}
      />
    );
  }

  openFeedback(row) {
    const path = '/feedback/' + row.id;
    this.props.changeView(path);
  }

  openChild(row) {
    const path = '/children/' + row.id;
    this.props.changeView(path);
  }

  render() {
    const { feedback, children, intl: { formatMessage } } = this.props;

    const renderFeedback = (
      <Grid item xs={12} sm={6}>
        <Paper className="paper" elevation={1}>
          <Typography type="headline">
            {formatMessage({ id: 'latestFeedback' })}
          </Typography>

          {this.generateTable(feedback, this.openFeedback.bind(this))}
        </Paper>
      </Grid>
    );

    const renderChildren = (
      <Grid item xs={12} sm={6}>
        <Paper className="paper" elevation={1}>
          <Typography type="headline">
            {formatMessage({ id: 'needingAttention' })}
          </Typography>
          <Typography style={{ color: grey[600] }}>
            {formatMessage({ id: 'needingAttentionExpalain' })}
          </Typography>

          {this.generateTable(children, this.openChild.bind(this))}
        </Paper>
      </Grid>
    );

    return (
      <div>
        <PageHeader header={formatMessage({ id: 'HemmoAdmin' })} />

        <Grid container gutter={24}>
          {renderFeedback}
          {renderChildren}
        </Grid>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
