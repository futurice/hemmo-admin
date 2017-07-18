import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Card, { CardActions, CardContent } from 'material-ui/Card';
import { LabelSwitch } from 'material-ui/Switch';
import { red } from 'material-ui/styles/colors';
import Button from 'material-ui/Button';
import FormControl from 'material-ui/Form/FormControl';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';

import DeleteDialog from '../components/DeleteDialog';

@injectIntl
export default class ChildBasic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false,
      anchorEl: undefined,
      selectedIndex: props.child.assigneeId,
      assigneeOpen: false,
    };

    this.closeAssigneeMenu = this.closeAssigneeMenu.bind(this);
    this.openAssigneeMenu = this.openAssigneeMenu.bind(this);
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

  openAssigneeMenu(event) {
    this.setState({
      assigneeOpen: true,
      anchorEl: event.currentTarget,
    });
  }

  closeAssigneeMenu() {
    this.setState({
      assigneeOpen: false,
    });
  }

  selectAssignee(event, assigneeId) {
    this.props.onUpdate(this.props.child.id, {
      assigneeId: assigneeId,
    });

    this.setState({
      selectedIndex: assigneeId,
      assigneeOpen: false,
    });
  }

  render() {
    const { employees, child, intl: { formatMessage } } = this.props;

    return (
      <div>
        <Card>
          <CardContent>
            <FormControl className="form-control">
              <Typography type="subheading">
                {formatMessage({ id: 'createdAt' })}
              </Typography>
              <Typography className="indent">
                {this.formatDate(child.createdAt)}
              </Typography>
            </FormControl>
            <FormControl className="form-control" style={{ marginBottom: 0 }}>
              <Typography type="subheading">
                {formatMessage({ id: 'assignee' })}
              </Typography>
              <div className="indent">
                <List>
                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="When device is locked"
                    onClick={this.openAssigneeMenu}
                  >
                    <ListItemText primary={child.assigneeName} />
                  </ListItem>
                </List>
                <Menu
                  id="lock-menu"
                  anchorEl={this.state.anchorEl}
                  open={this.state.assigneeOpen}
                  onRequestClose={this.closeAssigneeMenu}
                >
                  {!employees.loading
                    ? employees.data.entries.map((opt, i) =>
                        <MenuItem
                          key={i}
                          selected={opt.id === this.state.selectedIndex}
                          onClick={event => this.selectAssignee(event, opt.id)}
                        >
                          {opt.name}
                        </MenuItem>,
                      )
                    : null}
                </Menu>
              </div>
            </FormControl>
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

ChildBasic.propTypes = {
  child: PropTypes.object.isRequired,
  employees: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
