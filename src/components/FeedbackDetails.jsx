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
import { red } from 'material-ui/styles/colors';

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
    this.props.onUpdate(this.props.child.id, {
      assigneeId: assigneeId,
    });
  }

  render() {
    const { data, employees, intl: { formatMessage } } = this.props;

    return (
      <div>
        <Card>
          <CardContent style={{ paddingBottom: 0 }}>
            <Typography type="headline">
              {formatMessage({ id: 'feedback' })}
            </Typography>
          </CardContent>
          <CardContent>
            <Grid container gutter={0}>
              <Grid item xs={12} sm={4} style={{ alignSelf: 'center' }}>
                <Typography type="subheading">
                  {formatMessage({ id: 'createdAt' })}:{' '}
                  {this.formatDate(data.createdAt)}
                </Typography>
              </Grid>
              <Grid item item xs={12} md={4}>
                <Typography
                  type="subheading"
                  component="span"
                  className="assignee"
                >
                  {formatMessage({ id: 'assignee' })}
                </Typography>
                <SelectMenu
                  id="assignee-feedback"
                  selectedId={data.assigneeId}
                  loading={employees.loading}
                  data={employees.data.entries}
                  label={data.assigneeName}
                  onSelect={this.selectAssignee}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
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
