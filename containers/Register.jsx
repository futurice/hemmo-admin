import React from 'react';
import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import Header from '../components/Header';
import TextField from 'material-ui/TextField';

import { replace } from 'react-router-redux'

import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Account from 'material-ui/svg-icons/action/account-circle';

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
    this.props.dispatch(replace('/'));
  }

  openLogin() {
    let redirect = '/login';
    this.props.dispatch(replace(redirect));
  }

  shouldComponentUpdate(props) {
    if (props.auth.data.token) {
      props.login.data.token = props.auth.data.token;
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
              titleStyle={{
                color: this.context.muiTheme.palette.alternateTextColor
              }}
              subtitleStyle={{
                color: this.context.muiTheme.palette.accent2Color
              }}
            />
            <div style={{textAlign: 'center', marginTop: this.context.muiTheme.spacing.desktopGutter}}>
              <Account style={{
                height: '100px',
                width: '100px',
                textAlign: 'center',
                color: this.context.muiTheme.palette.primary3Color
              }}/>
            </div>
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
              margin: this.context.muiTheme.spacing.desktopGutter,
              marginBottom: '0px',
              marginTop: '0px'
            }}>
              margin: this.context.muiTheme.spacing.desktopGutter
            }}>
              <RaisedButton disabled={
                auth.loading || !this.state.email.length || !this.state.password.length
              } label="Register" fullWidth={true} primary={true} onTouchTap={this.doRegister.bind(this)} />
            </CardActions>
            <CardActions style={{
              margin: this.context.muiTheme.spacing.desktopGutter,
              marginTop: '0px'
            }}>
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
    login: state.auth,
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
