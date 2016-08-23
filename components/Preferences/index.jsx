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

// Colors
import {
  red500
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

    return(
      <Card style={{
        margin: spacing.desktopGutter,
        marginBottom: 0
      }}>
        <CardHeader
          title={'Reset employee password'}
          avatar={<Warning style={{color:red500}}/>}
          />

        <CardTitle subtitle={'Employee:'}>
          <CardText>
            <SelectField onChange={this.setEmployeeId} value={this.state.employeeId}>
              {this.props.employees.data.map((row, index) => (
                <MenuItem key={index} value={row.employeeId} primaryText={row.name} />
              ))}
            </SelectField>
          </CardText>
        </CardTitle>

        <CardTitle subtitle={'New password:'}>
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
            <RaisedButton backgroundColor={red500} label="Change password"
              disabled={
                this.state.password1 !== this.state.password2 || this.state.password1 === ''
              }
              onTouchTap={() => {
                this.changePassword(this.state.password1, this.state.employeeId);
              }}
              icon={<Lock/>} />
          </CardText>
          <CardText>
            { this.state.error }
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
