import React from 'react';
import { connect } from 'react-redux';
import rest from '../utils/rest';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import { LabelSwitch } from 'material-ui/Switch';
import Edit from 'material-ui-icons/Edit';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions,
} from 'material-ui/Dialog';
import { CircularProgress } from 'material-ui/Progress';
import FormControl from 'material-ui/Form/FormControl';
import Divider from 'material-ui/Divider';

import TableCard from '../components/TableCard';

const emptyEmployee = {
  id: null,
  name: '',
  email: '',
  active: false,
  resetPassword: false,
};

@injectIntl
class EmployeeManagement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderBy: 'name',
      order: 'asc',
      name1: '',
      page: 0,
      pageEntries: 20,
      dialogOpen: false,
      user: emptyEmployee,
      submitting: false,
    };

    this.updateAttr = this.updateAttr.bind(this);
    this.canSubmit = this.canSubmit.bind(this);
    this.loadEmployee = this.loadEmployee.bind(this);
    this.loadEmployees = this.loadEmployees.bind(this);
    this.saveEmployee = this.saveEmployee.bind(this);
    this.notSubmitting = this.notSubmitting.bind(this);
  }

  componentWillMount() {
    this.loadEmployees();
  }

  loadEmployees(p = {}) {
    const { dispatch } = this.props;
    const params = Object.assign(this.state, p);

    this.setState({ ...this.state, params });

    let queryParams = {
      offset: params.page * params.pageEntries,
      limit: params.pageEntries,
      name: params.name1,
      orderBy: params.orderBy,
      order: params.order,
    };

    dispatch(rest.actions.employees(queryParams));
  }

  loadEmployee(userId) {
    const { dispatch } = this.props;

    dispatch(
      rest.actions.employee.get({ id: userId }, () => {
        this.setState({
          dialogOpen: true,
          user: this.props.employee.data,
        });
      }),
    );
  }

  addUserDialog() {
    this.setState({
      dialogOpen: true,
      user: {
        ...emptyEmployee,
        active: true,
      },
    });
  }

  closeDialog() {
    this.setState({
      dialogOpen: false,
      user: emptyEmployee,
    });
  }

  notSubmitting() {
    this.setState({ submitting: false });
  }

  saveEmployee() {
    const { dispatch } = this.props;
    const body = {
      name: this.state.user.name,
      email: this.state.user.email,
      active: this.state.user.active,
    };

    this.setState({ submitting: true });

    if (this.state.user.id) {
      body.resetPassword = this.state.user.resetPassword;

      dispatch(
        rest.actions.employee.patch(
          { id: this.state.user.id },
          { body: JSON.stringify(body) },
        ),
      )
        .then(response => {
          this.closeDialog();
          this.loadEmployees();
          this.notSubmitting();
        })
        .catch(this.notSubmitting);
    } else {
      dispatch(
        rest.actions.employeeCreate(null, { body: JSON.stringify(body) }),
      )
        .then(response => {
          this.closeDialog();
          this.loadEmployees();
          this.notSubmitting();
        })
        .catch(this.notSubmitting);
    }
  }

  updateAttr(event) {
    const value = event.target.value;
    const field = event.target.name;

    this.setState({ user: { ...this.state.user, [field]: value } });
  }

  canSubmit() {
    const emailRegexp = new RegExp(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      'i',
    );

    return (
      !this.state.submitting &&
      this.state.user.name.length &&
      this.state.user.email.length &&
      emailRegexp.test(this.state.user.email)
    );
  }

  render() {
    const { employees, employee, intl: { formatMessage } } = this.props;
    const initialPage = 0;
    const pageEntries = 20;
    const header = [
      {
        id: 'name',
        value: row => row.name,
        columnTitle: formatMessage({ id: 'employeeName' }),
      },
      {
        id: 'email',
        value: row => row.email,
        columnTitle: formatMessage({ id: 'email' }),
      },
      {
        id: 'createdAt',
        value: row => new Date(row.createdAt).toLocaleDateString(),
        columnTitle: formatMessage({ id: 'createdAt' }),
        maxShowWidth: 440,
      },
      {
        component: (
          <IconButton onClick={this.toggleEmployee}>
            <Edit />
          </IconButton>
        ),
        className: 'row-action',
      },
    ];

    return (
      <div className="employee-management">
        <Typography type="title">
          {formatMessage({ id: 'employeeManagement' })}
        </Typography>

        <Button
          className="add-employee"
          color="primary"
          onClick={() => this.addUserDialog()}
        >
          {formatMessage({ id: 'addEmployee' })}
        </Button>

        <TableCard
          initialPage={initialPage}
          pageEntries={pageEntries}
          model={employees}
          orderBy={this.state.orderBy}
          order={this.state.order}
          header={header}
          onClickRow={this.loadEmployee}
          refresh={this.loadEmployees}
          hideElems={['showAll', 'name2']}
        />

        <Dialog
          onRequestClose={this.closeDialog.bind(this)}
          open={this.state.dialogOpen}
          className="dialog"
        >
          <DialogTitle>
            {employee.data.id
              ? formatMessage({ id: 'editEmployee' })
              : formatMessage({ id: 'addEmployee' })}
          </DialogTitle>
          <DialogContent className="dialog-content">
            {employee.loading
              ? <div style={{ textAlign: 'center' }}>
                  <CircularProgress />
                </div>
              : <div>
                  <FormControl className="form-control">
                    <TextField
                      className="full-width-text-field"
                      name="name"
                      value={this.state.user.name}
                      label={formatMessage({ id: 'name' })}
                      onChange={this.updateAttr}
                    />
                  </FormControl>

                  <FormControl className="form-control">
                    <TextField
                      name="email"
                      className="full-width-text-field"
                      value={this.state.user.email}
                      label={formatMessage({ id: 'email' })}
                      onChange={this.updateAttr}
                    />
                  </FormControl>

                  <FormControl className="form-control" style={{marginBottom: 0}}>
                    <LabelSwitch
                      checked={this.state.user.active}
                      label={formatMessage({ id: 'active' })}
                      onChange={(event, checked) => {
                        this.setState({
                          user: { ...this.state.user, active: checked },
                        });
                      }}
                    />
                  </FormControl>
                  <Divider />
                  <FormControl className="form-control">
                    <LabelSwitch
                      checked={this.state.user.resetPassword}
                      label={formatMessage({ id: 'resetPassword' })}
                      onChange={(event, checked) => {
                        this.setState({
                          user: { ...this.state.user, resetPassword: checked },
                        });
                      }}
                    />
                    {this.state.user.resetPassword
                      ? <Typography>
                          {formatMessage({ id: 'resetPasswordExplanation' })}
                        </Typography>
                      : ''}
                  </FormControl>
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
      </div>
    );
  }
}

function select(state, ownParams) {
  return {
    employees: state.employees,
    employee: state.employee,
  };
}

export default connect(select)(EmployeeManagement);
