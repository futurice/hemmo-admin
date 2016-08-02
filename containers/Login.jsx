import React from 'react';
import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { DEFAULT_VIEW } from '../constants/Views';

import RaisedButton from 'material-ui/RaisedButton';
import Header from '../components/Header';
import TextField from 'material-ui/TextField';
import * as Actions from '../actions/api/auth';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }
  }

  doLogin() {
    this.props.actions.loginStart(this.state);
  }

  handleChange(field, event) {
    this.setState({
      [field]: event.target.value
    });
  }

  render() {
    return(
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: this.context.muiTheme.spacing.desktopGutter
      }}>
        <Card style={{
          flex: 1,
          maxWidth: '350px'
        }}>
          <CardHeader
            title='Welcome back!'
            subtitle='Please log in:'
            style={{
              backgroundColor: this.context.muiTheme.palette.primary1Color
            }}
            titleColor={this.context.muiTheme.palette.alternateTextColor}
            subtitleColor={this.context.muiTheme.palette.accent2Color}
          />
          <CardText>
            <TextField
              floatingLabelText='Email'
              value={this.state.email}
              onChange={(event) => this.handleChange('email', event)}
              hintText='Enter your email'
              fullWidth={true}
            />
            <TextField
              hintText='Password'
              value={this.state.password}
              onChange={(event) => this.handleChange('password', event)}
              floatingLabelText='Password'
              type='password'
              fullWidth={true}
            />
          </CardText>
          <CardActions style={{
            margin: this.context.muiTheme.spacing.desktopGutter
          }}>
            <RaisedButton label="Login" fullWidth={true} primary={true} onTouchTap={this.doLogin.bind(this)} />
          </CardActions>
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.api.get('data'),
    loading: state.api.get('loading'),
    error: state.api.get('error')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

Login.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login));
