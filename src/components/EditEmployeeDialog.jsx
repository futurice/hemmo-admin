import React from 'react';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { LabelSwitch } from 'material-ui/Switch';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions,
} from 'material-ui/Dialog';
import FullscreenSpinner from './FullscreenSpinner';
import FormControl from 'material-ui/Form/FormControl';
import Divider from 'material-ui/Divider';

@injectIntl
export default class EditEmployeeDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.employeeDetails.id || null,
      name: this.props.employeeDetails.name || '',
      email: this.props.employeeDetails.email || '',
      active: this.props.employeeDetails.active || true,
      resetPassword: false,
    };
  }

  closeDialog() {
    this.props.onRequestClose();
  }

  saveEmployee() {
    let body = {
      name: this.state.name,
      email: this.state.email,
      active: this.state.active,
    };

    if (this.state.resetPassword) {
      body.resetPassword = true;
    }

    this.props.onRequestSave(this.state.id, body);
  }

  canSubmit() {
    const emailRegexp = new RegExp(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      'i',
    );

    return (
      !this.props.saving &&
      this.state.name.length &&
      this.state.email.length &&
      emailRegexp.test(this.state.email)
    );
  }

  updateAttr(event) {
    const value = event.target.value;
    const field = event.target.name;

    this.setState({ ...this.state, [field]: value });
  }

  render() {
    const { open, loading, intl: { formatMessage } } = this.props;

    return (
      <Dialog
        onRequestClose={this.closeDialog.bind(this)}
        open={open}
        className="dialog"
      >
        <DialogTitle>
          {this.state.id
            ? formatMessage({ id: 'editEmployee' })
            : formatMessage({ id: 'addEmployee' })}
        </DialogTitle>
        <DialogContent className="dialog-content">
          {loading
            ? <FullscreenSpinner />
            : <div>
                <FormControl className="form-control">
                  <TextField
                    className="full-width-text-field"
                    name="name"
                    value={this.state.name}
                    label={formatMessage({ id: 'name' })}
                    onChange={this.updateAttr.bind(this)}
                  />
                </FormControl>

                <FormControl className="form-control">
                  <TextField
                    name="email"
                    className="full-width-text-field"
                    value={this.state.email}
                    label={formatMessage({ id: 'email' })}
                    onChange={this.updateAttr.bind(this)}
                  />
                </FormControl>

                <FormControl
                  className="form-control"
                  style={{ marginBottom: 0 }}
                >
                  <LabelSwitch
                    checked={this.state.active}
                    label={formatMessage({ id: 'active' })}
                    onChange={(event, checked) => {
                      this.setState({
                        ...this.state.user,
                        active: checked,
                      });
                    }}
                  />
                </FormControl>
                {this.state.id
                  ? <div>
                      <Divider />
                      <FormControl className="form-control">
                        <LabelSwitch
                          checked={this.state.resetPassword}
                          label={formatMessage({ id: 'resetPassword' })}
                          onChange={(event, checked) => {
                            this.setState({
                              ...this.state,
                              resetPassword: checked,
                            });
                          }}
                        />
                        {this.state.resetPassword
                          ? <Typography>
                              {formatMessage({
                                id: 'resetPasswordExplanation',
                              })}
                            </Typography>
                          : ''}
                      </FormControl>
                    </div>
                  : null}
              </div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog.bind(this)}>
            {formatMessage({ id: 'close' })}
          </Button>
          <Button
            onClick={this.saveEmployee.bind(this)}
            disabled={!this.canSubmit()}
            color="primary"
          >
            {formatMessage({ id: 'save' })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
