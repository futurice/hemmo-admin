import React from 'react';
import { connect } from 'react-redux';
import rest from '../utils/rest';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui-icons/Edit';

import TableCard from '../components/TableCard';

const mapStateToProps = state => ({
  organisation: state.employees,
});

const mapDispatchToProp = dispatch => ({
  loadOrganisation: () => {
    dispatch(rest.actions.organisations.get());
  },
  saveOrganisationUnit: (id, leftId, rightId, name) => {
    dispatch(
      rest.actions.organisations.put(
        { organisationId: id },
        {
          body: {
            leftId,
            rightId,
            name,
          },
        },
      ),
    );
  },
  createOrganisationUnit: (parent, name) => {
    dispatch(
      rest.actions.organisations.post({
        parent,
        name,
      }),
    );
  },
  deleteOrganisationUnit: id => {
    dispatch(
      rest.actions.organisations.delete({
        organisationId: id,
      }),
    );
  },
});

@injectIntl
class OrganisationManagement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderBy: 'name',
      order: 'asc',
      name1: '',
      page: 0,
      pageEntries: 20,
      dialogOpen: false,
      submitting: false,
    };

    this.saveOrganisationUnit = this.saveOrganisationUnit.bind(this);
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
    const { organisations, intl: { formatMessage } } = this.props;
    const initialPage = 0;
    const pageEntries = 20;
    const header = [
      {
        id: 'name',
        value: row => row.name,
        columnTitle: formatMessage({ id: 'organisationUnit' }),
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
          model={organisations}
          header={header}
          onClickRow={this.loadEmployee}
          refresh={this.loadOrganisation}
          hideToolbar={true}
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

export default connect(mapStateToProps, mapDispatchToProp)(
  OrganisationManagement,
);
