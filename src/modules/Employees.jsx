import React from 'react';
import { connect } from 'react-redux';
import rest from '../utils/rest';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui-icons/Edit';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';

import PageHeader from '../components/PageHeader';
import TableCard from '../components/TableCard';
import EditEmployeeDialog from '../components/EditEmployeeDialog';

const mapStateToProps = state => ({
  employees: state.employees,
  employee: state.employee,
  organisation: state.organisations,
  scope: state.auth.data.decoded.scope,
});

const mapDispatchToProps = dispatch => ({
  getOrganisation: () => {
    dispatch(rest.actions.organisations());
  },
  getEmployees: params => {
    dispatch(rest.actions.employees(params));
  },
  getEmployee: (employeeId, cb) => {
    dispatch(rest.actions.employee.get({ id: employeeId }, cb));
  },
  saveEmployee: (employeeId, body, cb, fail) => {
    dispatch(
      rest.actions.employee.patch(
        { id: employeeId },
        { body: JSON.stringify(body) },
      ),
    )
      .then(cb)
      .catch(fail);
  },
  createEmployee: (body, cb, fail) => {
    dispatch(rest.actions.employeeCreate(null, { body: JSON.stringify(body) }))
      .then(cb)
      .catch(fail);
  },
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
    this.closeAndLoad = this.closeAndLoad.bind(this);
  }

  componentWillMount() {
    this.loadEmployees();
    this.props.getOrganisation();
  }

  loadEmployees(p = {}) {
    const params = Object.assign(this.state, p);

    this.setState({ ...this.state, params });

    let queryParams = {
      offset: params.page * params.pageEntries,
      limit: params.pageEntries,
      name: params.name1,
      orderBy: params.orderBy,
      order: params.order,
    };

    this.props.getEmployees(queryParams);
  }

  loadEmployee(user) {
    this.props.getEmployee(
      user.id,
      this.setState({
        dialogOpen: true,
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

  closeAndLoad() {
    this.closeDialog();
    this.loadEmployees();
    this.notSubmitting();
  }

  saveEmployee(employeeId, data) {
    this.setState({ submitting: true });

    if (employeeId) {
      this.props.saveEmployee(
        employeeId,
        data,
        this.closeAndLoad,
        this.notSubmitting,
      );
    } else {
      this.props.createEmployee(data, this.closeAndLoad, this.notSubmitting);
    }
  }

  render() {
    const {
      scope,
      employees,
      employee,
      organisation,
      intl: { formatMessage },
    } = this.props;
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
        id: 'userStatus',
        columnTitle: formatMessage({ id: 'userStatus' }),
        component: row =>
          <IconButton disabled={!row.active}>
            {row.active ? <Visibility /> : <VisibilityOff />}
          </IconButton>,
      },
      {
        id: 'childrenCount',
        columnTitle: formatMessage({ id: 'childrenCount' }),
        value: row => row.childrenCount.toString(),
        className: 'align-right',
      },
      {
        id: 'createdAt',
        value: row =>
          new Date(row.createdAt).toLocaleDateString(navigator.languages, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
        columnTitle: formatMessage({ id: 'createdAt' }),
        maxShowWidth: 440,
      },
      {
        id: 'organisation',
        value: row => row.organisationName,
        columnTitle: formatMessage({ id: 'organisationUnit' }),
      },
    ];

    if (scope === 'admin') {
      header.push({
        component: (
          <IconButton onClick={this.toggleEmployee}>
            <Edit />
          </IconButton>
        ),
        className: 'row-action',
      });
    }

    return (
      <div className="employee-management">
        <PageHeader header={formatMessage({ id: 'employeeManagement' })} />

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
              organisation={organisation.data.entries}
              loading={employee.loading}
              saving={this.state.submitting}
              isAdmin={this.props.scope === 'admin'}
              onRequestSave={this.saveEmployee.bind(this)}
              onRequestClose={this.closeDialog.bind(this)}
            />
          : null}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeManagement);
