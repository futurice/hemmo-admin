import React from 'react';
import { connect } from 'react-redux';
import rest from '../utils/rest';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui-icons/Edit';

import TableCard from '../components/TableCard';
import EditEmployeeDialog from '../components/EditEmployeeDialog';

const mapStateToProps = state => ({
  employees: state.employees,
  employee: state.employee,
});

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
      user: {},
      submitting: false,
    };

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

  loadEmployee(user) {
    const { dispatch } = this.props;

    dispatch(
      rest.actions.employee.get({ id: user.id }, () => {
        this.setState({
          dialogOpen: true,
        });
      }),
    );
  }

  openDialog() {
    this.setState({
      dialogOpen: true,
      user: {},
    });
  }

  closeDialog() {
    this.setState({
      dialogOpen: false,
      user: {},
    });
  }

  notSubmitting() {
    this.setState({ submitting: false });
  }

  saveEmployee(employeeId, data) {
    const { dispatch } = this.props;

    this.setState({ submitting: true });

    if (employeeId) {
      dispatch(
        rest.actions.employee.patch(
          { id: employeeId },
          { body: JSON.stringify(data) },
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
        rest.actions.employeeCreate(null, { body: JSON.stringify(data) }),
      )
        .then(response => {
          this.closeDialog();
          this.loadEmployees();
          this.notSubmitting();
        })
        .catch(this.notSubmitting);
    }
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
          onClick={() => this.openDialog()}
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

        {this.state.dialogOpen
          ? <EditEmployeeDialog
              open={this.state.dialogOpen}
              employeeDetails={employee.data}
              loading={this.state.loading}
              saving={this.state.submitting}
              onRequestSave={this.saveEmployee.bind(this)}
              onRequestClose={this.closeDialog.bind(this)}
            />
          : null}
      </div>
    );
  }
}

export default connect(mapStateToProps)(EmployeeManagement);
