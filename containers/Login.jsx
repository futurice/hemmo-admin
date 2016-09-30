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

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
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

  openRegister() {
    let redirect = '/register';
    this.props.dispatch(replace(redirect));
  }

  shouldComponentUpdate(props) {
    if (props.auth.data && props.auth.data.token) {
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

  doLogin() {
    const {dispatch} = this.props;
    dispatch(rest.actions.auth(null, {
      body: JSON.stringify({
        email: this.refs.email.getValue(),
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
              title='Welcome back!'
              subtitle='Please log in:'
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
                    this.doLogin();
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
                    this.doLogin();
                  }
                }}
              />
            </CardText>
            <CardText style={{
              textAlign: 'center'
            }}>
              {!auth.error && auth.data && auth.data.message ? String('Note: ' + auth.data.message) : ''}
              {auth.error && auth.error.message ? String('Error: ' + auth.error.message) : ''}
            </CardText>
            <CardActions style={{
              margin: this.context.muiTheme.spacing.desktopGutter,
              marginBottom: '0px',
              marginTop: '0px'
            }}>
              <RaisedButton disabled={
                auth.loading || !this.state.email.length || !this.state.password.length
              } label="Login" fullWidth={true} primary={true} onTouchTap={this.doLogin.bind(this)} />
            </CardActions>
            <CardActions style={{
              margin: this.context.muiTheme.spacing.desktopGutter,
              marginTop: '0px'
            }}>
              <RaisedButton label="No account? Register!" fullWidth={true} primary={true} onTouchTap={this.openRegister.bind(this)} />
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
    auth: state.auth,
    routing: state.routing,
    redirect: ownProps.location.query.redirect
  };
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired
};

Login.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default withRouter(connect(select)(Login));
