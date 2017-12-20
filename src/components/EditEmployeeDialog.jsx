import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Switch from 'material-ui/Switch';
import { FormControlLabel, FormLabel } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions,
} from 'material-ui/Dialog';
import FullscreenSpinner from './FullscreenSpinner';
import FormControl from 'material-ui/Form/FormControl';
import Divider from 'material-ui/Divider';

import SelectMenu from '../components/SelectMenu';

@injectIntl
export default class EditEmployeeDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      name: '',
      email: '',
      active: true,
      organisationId: null,
      organisationName: '',
      resetPassword: false,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      id: newProps.employeeDetails.id || null,
      name: newProps.employeeDetails.name || '',
      email: newProps.employeeDetails.email || '',
      active:
        newProps.employeeDetails.active !== null &&
        newProps.employeeDetails.active !== undefined
          ? newProps.employeeDetails.active
          : true,
      organisationId: newProps.employeeDetails.organisationId || null,
      organisationName: newProps.employeeDetails.organisationName || '',
      isAdmin: newProps.employeeDetails.scope === 'admin' || false,
    });
  }

  closeDialog() {
    this.props.onRequestClose();
  }

  saveEmployee() {
    let body = {
      name: this.state.name,
      email: this.state.email,
      active: this.state.active.toString(),
      organisationId: this.state.organisationId,
    };

    if (this.state.resetPassword) {
      body.resetPassword = true;
    }

    if (this.props.isAdmin) {
      body.scope = this.state.isAdmin ? 'admin' : 'employee';
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

  selectOrganisation(organisationId) {
    this.setState({
      organisationId,
      organisationName: this.props.organisation.find(
        org => org.id === organisationId,
      ).name,
    });
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
          {loading ? (
            <FullscreenSpinner />
          ) : (
            <div>
              <FormControl className="form-control">
                <TextField
                  className="full-width-text-field"
                  name="name"
                  value={this.state.name}
                  label={formatMessage({ id: 'name' })}
                  onChange={this.updateAttr.bind(this)}
                  disabled={!this.props.isAdmin && !this.props.isSelf}
                />
              </FormControl>

              <FormControl className="form-control">
                <TextField
                  name="email"
                  className="full-width-text-field"
                  value={this.state.email}
                  label={formatMessage({ id: 'email' })}
                  onChange={this.updateAttr.bind(this)}
                  disabled={!this.props.isAdmin && !this.props.isSelf}
                />
              </FormControl>

              {this.props.isAdmin ? (
                <FormControl className="form-control">
                  <FormLabel>
                    {formatMessage({ id: 'organisationUnit' })}
                  </FormLabel>
                  <SelectMenu
                    id="organisation-position"
                    selectedId={this.state.organisationId || 0}
                    loading={this.props.loading}
                    data={this.props.organisation}
                    label={this.state.organisationName}
                    onSelect={this.selectOrganisation.bind(this)}
                  />
                </FormControl>
              ) : null}

              {this.props.isAdmin ? (
                <FormControl
                  className="form-control"
                  style={{ marginBottom: 0 }}
                >
                  <FormLabel>
                    {formatMessage({ id: 'accountStatus' })}
                  </FormLabel>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.active}
                        onChange={(event, checked) => {
                          this.setState({
                            ...this.state.user,
                            active: checked,
                          });
                        }}
                      />
                    }
                    label={formatMessage({ id: 'active' })}
                  />
                </FormControl>
              ) : null}
              {this.props.isAdmin ? (
                <FormControl
                  className="form-control"
                  style={{ marginBottom: 0 }}
                >
                  <FormLabel>{formatMessage({ id: 'isSuperAdmin' })}</FormLabel>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.isAdmin}
                        onChange={(event, checked) => {
                          this.setState({
                            ...this.state.isAdmin,
                            isAdmin: checked,
                          });
                        }}
                      />
                    }
                    label={formatMessage({ id: 'superAdmin' })}
                  />
                </FormControl>
              ) : null}
              {this.state.id && this.props.isAdmin ? (
                <div>
                  <Divider />
                  <FormControl className="form-control">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.resetPassword}
                          onChange={(event, checked) => {
                            this.setState({
                              ...this.state,
                              resetPassword: checked,
                            });
                          }}
                        />
                      }
                      label={formatMessage({ id: 'resetPassword' })}
                    />
                    {this.state.resetPassword ? (
                      <Typography>
                        {formatMessage({
                          id: 'resetPasswordExplanation',
                        })}
                      </Typography>
                    ) : (
                      ''
                    )}
                  </FormControl>
                </div>
              ) : null}
            </div>
          )}
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

EditEmployeeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  employeeDetails: PropTypes.object.isRequired,
  organisation: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isSelf: PropTypes.bool.isRequired,
  onRequestSave: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
