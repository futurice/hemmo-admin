import React from 'react';
import { connect } from 'react-redux';
import rest from '../utils/rest';
import { injectIntl } from 'react-intl';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import { LabelSwitch } from 'material-ui/Switch';
import CardGridWrapper from '../components/CardGridWrapper';
import Card, { CardContent, } from 'material-ui/Card';
import AddIcon from 'material-ui-icons/Add';
import Edit from 'material-ui-icons/Edit';
import TextField from 'material-ui/TextField';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import { CircularProgress } from 'material-ui/Progress';

import ModelTable from './ModelTable';

const emptyEmployee = {
  id: null,
  name: '',
  email: '',
  active: false
};

@injectIntl
class EmployeeManagement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderBy: 'name',
      order: 'asc',
      searchName: '',
      page: 0,
      pageEntries: 20,
      dialogOpen: false,
      user: emptyEmployee
    };

    this.updateAttr = this.updateAttr.bind(this);
    this.canSubmit = this.canSubmit.bind(this);
    this.openEmployee = this.openEmployee.bind(this);
    this.loadEmployees = this.loadEmployees.bind(this);
    this.saveEmployee = this.saveEmployee.bind(this);
  }

  componentWillMount() {
    this.loadEmployees();
  }

  loadEmployees(p = {}) {
    const { dispatch } = this.props;
    const params = Object.assign(this.state, p);

    this.setState({...this.state, params});

    let queryParams = {
      offset: params.page * params.pageEntries,
      limit: params.pageEntries,
      showAll: params.showAll,
      name: params.name,
      orderBy: params.orderBy,
      order: params.order
    };

    dispatch(rest.actions.employees(queryParams));
  }

  openEmployee(userId) {
    const { dispatch } = this.props;

    dispatch(rest.actions.employeeDetails({id: userId}, () => {
      this.setState({
        dialogOpen: true,
        user: this.props.employeeDetails.data
      });
    }));
  }

  addUserDialog() {
    this.setState({
      dialogOpen: true,
      user: {
        ...emptyEmployee, active: true
      }
    });
  }

  closeDialog() {
    this.setState({
      dialogOpen: false,
      user: emptyEmployee
    });
  }

  saveEmployee() {
    const { dispatch } = this.props;
    const body = {
      body: JSON.stringify({
        name: this.state.user.name,
        email: this.state.user.email,
        active: this.state.user.active
      })
    };

    if (this.state.user.id) {
      dispatch(rest.actions.employeeSave({id: this.state.user.id}, body, () => {
        this.closeDialog();
        this.loadEmployees();
      }))
    }
    else {
      dispatch(rest.actions.employeeCreate(null, body, () => {
        this.closeDialog();
        this.loadEmployees();
      }))
    }
  }

  updateAttr(event) {
    const value = event.target.value;
    const field = event.target.name;

    this.setState({user: {...this.state.user, [field]: value }});
  }

  canSubmit() {
    const emailRegexp = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'i');
    return this.state.user.name.length && this.state.user.email.length && emailRegexp.test(this.state.user.email);
  }

  render() {
    const { employeeDetails, scope, intl: { formatMessage } } = this.props;
    const header = [
      {
        id: 'name',
        value: row => row.name,
        columnTitle: formatMessage({id: 'employeeName'})
      },
      {
        id: 'email',
        value: row => row.email,
        columnTitle: formatMessage({id: 'email'})
      },
      {
        id: 'createdAt',
        value: row => new Date(row.createdAt).toLocaleDateString(),
        columnTitle: formatMessage({id: 'createdAt'}),
        maxShowWidth: 440
      },
      {
        component: (
          <IconButton onClick={this.toggleEmployee}>
            <Edit />
          </IconButton>)
      }
    ];

    return(
      <div>
        <CardGridWrapper>
          <Card>
            <CardContent className="manage-employees">
              <Typography type="title">{ formatMessage({id: 'employeeManagement'}) }</Typography>

              <Button fab className="add-employee" color="primary" onClick={() => this.addUserDialog()}><AddIcon /></Button>

              <TextField
                className="text-field"
                label={formatMessage({ id: 'name' })}
                onKeyUp={event => {
                  const val = event.target.value;
                  const keyword = (val.length >= 3) ? val : '';

                  if (keyword !== this.state.searchName) {
                    this.setState({
                      searchName: val.length >= 3 ? val : ''
                    }, this.refresh);
                  }
                }}
                marginForm
              />

              <ModelTable
                orderBy={this.state.orderBy}
                order={this.state.order}
                header={header}
                entries={this.props.employees.data}
                onClickRow={this.openEmployee}
                onSortRequest={this.loadEmployees}
              />
            </CardContent>
          </Card>
        </CardGridWrapper>

        <Dialog
          onRequestClose={this.closeDialog.bind(this)}
          open={this.state.dialogOpen}
          className="dialog"
        >

          <DialogTitle>{ employeeDetails.data.id ? formatMessage({id: 'editEmployee'}) : formatMessage({id: 'addEmployee'}) }</DialogTitle>
          <DialogContent className="dialog-content">
            {employeeDetails.loading ? (
              <div style={{textAlign: 'center'}}>
                <CircularProgress/>
              </div>) :
            (<div>
              <TextField
                autoFocus
                name="name" value={this.state.user.name}
                label={formatMessage({ id: 'name' })}
                onChange={this.updateAttr} />

              <TextField
                name="email"
                value={this.state.user.email}
                label={formatMessage({ id: 'email' })} 
                onChange={this.updateAttr} />

              <LabelSwitch
                checked={this.state.user.active}
                onChange={(event, checked) => {
                  this.setState({ user: {...this.state.user, active: checked} });
                }}
                label={ formatMessage({ id: 'active' }) }
              />
            </div>)}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog.bind(this)}>{ formatMessage({id: 'close'}) }</Button>
            <Button onClick={this.saveEmployee.bind(this)} disabled={!this.canSubmit()} color="primary">{ formatMessage({id: 'save'}) }</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

function select(state, ownParams) {
  return {
    employees: state.employees,
    employeeDetails: state.employeeDetails
  };
}

export default connect(select)(EmployeeManagement);