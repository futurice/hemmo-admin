import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import FormControl from 'material-ui/Form/FormControl';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import { red, green } from 'material-ui/styles/colors';
import Done from 'material-ui-icons/Done';
import ReportProblem from 'material-ui-icons/ReportProblem';
import Divider from 'material-ui/Divider';

import DeleteDialog from './DeleteDialog';
import SelectMenu from './SelectMenu';

@injectIntl
export default class FeedbackDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false,
    };

    this.selectAssignee = this.selectAssignee.bind(this);
    this.toggleHandleStatus = this.toggleHandleStatus.bind(this);
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString(navigator.languages, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  handleDelete() {
    this.props.onDelete(this.props.childId, this.props.data.id);
  }

  selectAssignee(event, assigneeId) {
    this.props.onUpdate(this.props.data.id, {
      assigneeId: assigneeId,
    });
  }

  toggleHandleStatus() {
    this.props.onUpdate(this.props.data.id, {
      reviewed: !this.props.data.reviewed,
    });
  }

  render() {
    const { data, employees, intl: { formatMessage } } = this.props;

    return (
      <div className="feedback-details">
        <Card>
          <CardContent style={{ paddingBottom: 0 }}>
            <Typography type="headline">
              {formatMessage({ id: 'feedback' })}
            </Typography>
            <Typography type="subheading" className="subheading">
              <div>
                {formatMessage({ id: 'date' })}:{' '}
                {this.formatDate(data.createdAt)}
              </div>
              <div>
                {data.reviewed
                  ? <Done style={{ color: green[300] }} />
                  : <ReportProblem style={{ color: red[300] }} />}
                {formatMessage({
                  id: data.reviewed ? 'reviewed' : 'notReviewed',
                })}
              </div>
              <div className="mood-wrapper">
                {formatMessage({ id: 'moods' })}:{' '}
                {data.moods.map((mood, i) => {
                  return (
                    <span key={i} className="mood">
                      {mood}
                    </span>
                  );
                })}
              </div>
            </Typography>
          </CardContent>
          <CardContent>
            <Grid container gutter={0}>
              <Grid item item xs={6} md={6}>
                <Button
                  raised={!data.reviewed ? true : false}
                  color={!data.reviewed ? 'primary' : 'contrast'}
                  style={{ marginRight: '1rem', whiteSpace: 'nowrap' }}
                  onClick={this.toggleHandleStatus.bind(this)}
                >
                  {formatMessage({
                    id: !data.reviewed ? 'markReviewed' : 'markUnhandled',
                  })}
                </Button>
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
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{ alignSelf: 'center', textAlign: 'right' }}
              >
                <Button
                  color="accent"
                  style={{ color: red[300] }}
                  onClick={() => this.setState({ dialogOpen: true })}
                >
                  {formatMessage({ id: 'deleteFeedback' })}
                </Button>
              </Grid>
            </Grid>
            <Divider />
            <Grid container gutter={0} className="activities">
              <Typography type="subheading">
                {formatMessage({ id: 'activities' })}
              </Typography>
            </Grid>
          </CardContent>
        </Card>

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
  data: PropTypes.object.isRequired,
  employees: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
