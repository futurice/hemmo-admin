import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import rest from '../../reducers/api';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import Lock from 'material-ui/svg-icons/action/lock-outline';
import Warning from 'material-ui/svg-icons/alert/warning';
import Check from 'material-ui/svg-icons/navigation/check';

// Colors
import {
  red300,
  lightGreen300
} from 'material-ui/styles/colors';

class Preferences extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password1: '',
      password2: '',
      employeeId: props.employeeId,
      error: ''
    }

    this.setEmployeeId = this.setEmployeeId.bind(this);
  }

  verifyEmployee(employeeId) {
    const {dispatch} = this.props;

    dispatch(rest.actions.employeeVerify({
      employeeId
    }, err => {
      this.setState({
        error: err || this.props.error.data.message || 'Successfully verified employee. They may now log in.'
      });
      dispatch(rest.actions.employees());
    }));
  }

  changePassword(password, employeeId) {
    const {dispatch} = this.props;

    dispatch(rest.actions.employeePassword(null, {
      body: JSON.stringify({
        password,
        employeeId
      })
    }, err => {
      this.setState({
        error: err || this.props.error.data.message || 'Successfully changed password.'
      });
    }));
  }

  setEmployeeId(event, index, value) {
    this.setState({
      employeeId: value
    });
  }

  handleChange(event, field) {
    this.setState({
      [field]: event.target.value
    });
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(rest.actions.employees());
  }

  render() {
    const palette = this.context.muiTheme.palette;
    const spacing = this.context.muiTheme.spacing;

    let selectedEmployeeName = '(none)';
    let selectedEmployee = null;

    if (this.props.employees.data) {
      selectedEmployee = this.props.employees.data
        .find(employee => employee.employeeId === this.state.employeeId);
    }

    if (selectedEmployee) {
      selectedEmployeeName = selectedEmployee.name;
    }

    return(
      <Card style={{
        margin: spacing.desktopGutter,
        marginBottom: 0
      }}>
        <CardHeader
          title={'Employee management'}
          avatar={<Warning style={{color:red300}}/>}
          />

        <CardTitle subtitle={'Employee:'}>
          <CardText>
            <SelectField onChange={this.setEmployeeId} value={this.state.employeeId}>
              {this.props.employees.data.map((row, index) => (
                <MenuItem leftIcon={row.verified ? <Check/> : <Warning/> } key={index} value={row.employeeId} primaryText={row.name} />
              ))}
            </SelectField>
          </CardText>
        </CardTitle>

        <CardTitle subtitle={`Verify ${selectedEmployeeName}`}>
          <CardText>
            <RaisedButton backgroundColor={lightGreen300} label={
              selectedEmployee && selectedEmployee.verified ? 'Employee already verified' : `Verify ${selectedEmployeeName}, allowing them to log in`
            }
              disabled={
                selectedEmployee && selectedEmployee.verified
              }
              onTouchTap={() => {
                this.verifyEmployee(this.state.employeeId);
              }}
              icon={<Check/>} />
          </CardText>
        </CardTitle>

        <CardTitle subtitle={`Reset ${selectedEmployeeName}'s password:`}>
          <CardText>
            <TextField
              floatingLabelText='Password'
              onChange={(event) => this.handleChange(event, 'password1')}
              type='password' /> <br/>
            <TextField
              floatingLabelText='Re-enter password'
              onChange={(event) => this.handleChange(event, 'password2')}
              type='password' />
          </CardText>
          <CardText>
            <RaisedButton backgroundColor={red300} label={`Change ${selectedEmployeeName}'s password`}
              disabled={
                this.state.password1 !== this.state.password2 || this.state.password1 === ''
              }
              onTouchTap={() => {
                this.changePassword(this.state.password1, this.state.employeeId);
              }}
              icon={<Lock/>} />
          </CardText>
          <CardText>
            { String(this.state.error) }
          </CardText>
        </CardTitle>
      </Card>
    );
  }
}

Preferences.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

function select(state, ownProps) {
  return {
    employeeId: state.auth.data.employeeId,
    employees: state.employees,
    error: state.employeePassword
  };
}

export default connect(select)(Preferences);
