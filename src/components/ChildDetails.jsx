import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Card, { CardActions, CardContent } from 'material-ui/Card';
import { LabelSwitch } from 'material-ui/Switch';
import { red } from 'material-ui/styles/colors';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import DeleteDialog from './DeleteDialog';
import SelectMenu from './SelectMenu';

@injectIntl
export default class ChildDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false,
    };

    this.selectAssignee = this.selectAssignee.bind(this);
  }

  updateAlertSetting(event, checked) {
    this.props.onUpdate(this.props.child.id, {
      showAlerts: checked,
    });
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString(navigator.languages, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  handleDelete() {
    this.props.onDelete(this.props.child.id);
  }

  selectAssignee(assigneeId) {
    this.props.onUpdate(this.props.child.id, {
      assigneeId: assigneeId,
    });
  }

  render() {
    const { employees, child, intl: { formatMessage } } = this.props;

    return (
      <div>
        <Card>
          <CardContent style={{ paddingBottom: 0 }}>
            <Typography type="headline">
              {formatMessage({ id: 'childDetails' })}
            </Typography>
          </CardContent>
          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={6} style={{ alignSelf: 'center' }}>
                <Typography type="subheading">
                  {formatMessage({ id: 'createdAt' })}:{' '}
                  {this.formatDate(child.createdAt)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  type="subheading"
                  component="span"
                  className="assignee"
                >
                  {formatMessage({ id: 'assignee' })}:
                </Typography>
                <SelectMenu
                  id="assignee-child"
                  selectedId={child.assigneeId || ''}
                  loading={employees.loading}
                  data={employees.data.entries}
                  label={child.assigneeName || ''}
                  onSelect={this.selectAssignee}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid item xs={12} sm={9}>
              <LabelSwitch
                checked={this.props.child.showAlerts}
                label={formatMessage({ id: 'showAlerts' })}
                onChange={this.updateAlertSetting.bind(this)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                color="accent"
                style={{ color: red[300] }}
                onClick={() => this.setState({ dialogOpen: true })}
              >
                {formatMessage({ id: 'deleteChild' })}
              </Button>
            </Grid>
          </CardActions>
        </Card>

        <DeleteDialog
          handleDelete={this.handleDelete.bind(this)}
          handleClose={() => {
            this.setState({
              dialogOpen: false,
            });
          }}
          open={this.state.dialogOpen}
          message={formatMessage({ id: 'deleteChildWarn' })}
        />
      </div>
    );
  }
}

ChildDetails.propTypes = {
  child: PropTypes.object.isRequired,
  employees: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
