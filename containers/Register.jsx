import React from 'react';
import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { DEFAULT_VIEW } from '../constants/Views';

import RaisedButton from 'material-ui/RaisedButton';
import Header from '../components/Header';
import TextField from 'material-ui/TextField';

import { replace } from 'react-router-redux'

import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import rest from '../reducers/api';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      name: '',
      password: ''
    }
  }

  authSuccess() {
    let redirect = this.props.redirect;

    if (!redirect || redirect === '/logout') {
      redirect = '/';
    }

    this.props.dispatch(replace(redirect));
  }

  openLogin() {
    let redirect = '/login';
    this.props.dispatch(replace(redirect));
  }

  shouldComponentUpdate(props) {
    if (props.auth.data.token) {
      this.authSuccess();
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.refs.email.focus();
  }

  handleChange(event, field) {
    this.setState({
      [field]: event.target.value
    });
  }

  doRegister() {
    const {dispatch} = this.props;
    dispatch(rest.actions.register(null, {
      body: JSON.stringify({
        email: this.refs.email.getValue(),
        name: this.refs.name.getValue(),
        password: this.refs.password.getValue()
      })
    }));
  }

  render() {
    const { auth } = this.props;

    let spinner = auth.loading ? <CircularProgress /> : null;

    return(
      <div style={{
        textAlign: 'center',
        margin: this.context.muiTheme.spacing.desktopGutter
      }}>
        <div style={{
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'center',
          margin: this.context.muiTheme.spacing.desktopGutter
        }}>
          <Card style={{
            flex: 1,
            maxWidth: '350px'
          }}>
            <CardHeader
              title='Welcome!'
              subtitle='Register to start using this service.'
              style={{
                backgroundColor: this.context.muiTheme.palette.primary1Color
              }}
              titleColor={this.context.muiTheme.palette.alternateTextColor}
              subtitleColor={this.context.muiTheme.palette.accent2Color}
            />
            <CardText>
              <TextField
                ref='email'
                type='text'
                floatingLabelText='Email'
                hintText='Enter your email'
                fullWidth={true}
                onChange={(event) => {
                  if (event.keyCode !== 13) {
                    this.handleChange(event, 'email');
                  }
                }}
                onKeyDown={(event) => {
                  if (event.keyCode === 13) {
                    this.doRegister();
                  }
                }}
              />
              <TextField
                ref='name'
                type='text'
                floatingLabelText='Name'
                hintText='Enter your name'
                fullWidth={true}
                onChange={(event) => {
                  if (event.keyCode !== 13) {
                    this.handleChange(event, 'name');
                  }
                }}
                onKeyDown={(event) => {
                  if (event.keyCode === 13) {
                    this.doRegister();
                  }
                }}
              />
              <TextField
                ref='password'
                type='password'
                floatingLabelText='Password'
                hintText='Password'
                fullWidth={true}
                onChange={(event) => {
                  if (event.keyCode !== 13) {
                    this.handleChange(event, 'password');
                  }
                }}
                onKeyDown={(event) => {
                  if (event.keyCode === 13) {
                    this.doRegister();
                  }
                }}
              />
              {auth && auth.data.message ? String(auth.data.message) : ''}
            </CardText>
            <CardActions style={{
              margin: this.context.muiTheme.spacing.desktopGutter
            }}>
              <RaisedButton disabled={
                auth.loading || console.log(this.state.email.length) || !this.state.email.length || !this.state.password.length
              } label="Register" fullWidth={true} primary={true} onTouchTap={this.doRegister.bind(this)} />
            <RaisedButton label="Have account? Login!" fullWidth={true} primary={true} onTouchTap={this.openLogin.bind(this)} />

            </CardActions>
          </Card>
        </div>
        {spinner}
      </div>
    );
  }
}

function select(state, ownProps) {
  return {
    auth: state.register,
    routing: state.routing,
    redirect: ownProps.location.query.redirect
  };
}

Register.propTypes = {
  dispatch: PropTypes.func.isRequired
};

Register.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default withRouter(connect(select)(Register));
