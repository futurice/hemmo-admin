import React from 'react';
import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { DEFAULT_VIEW } from '../constants/Views';

import RaisedButton from 'material-ui/RaisedButton';
import Header from '../components/Header';
import TextField from 'material-ui/TextField';
import authActions from '../actions/api/auth';

import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import rest from '../reducers/api';

class Login extends Component {
  constructor(props) {
    super(props);
  }

  authSuccess() {
    this.props.router.push('/app/' + DEFAULT_VIEW);
  }

  shouldComponentUpdate(props) {
    if (props.auth.data.get('token')) {
      this.authSuccess();
      return false;
    }

    return true;
  }

  componentDidMount() {
    this.refs.email.focus();
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
    const {data, error, loading} = this.props;

    let spinner = loading ? <CircularProgress /> : null;

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
                onKeyDown={(event) => {if (event.keyCode === 13) this.doLogin();}}
              />
              <TextField
                ref='password'
                type='password'
                floatingLabelText='Password'
                hintText='Password'
                fullWidth={true}
                onKeyDown={(event) => {if (event.keyCode === 13) this.doLogin();}}
              />
              {error ? String(error) : ''}
            </CardText>
            <CardActions style={{
              margin: this.context.muiTheme.spacing.desktopGutter
            }}>
              <RaisedButton disabled={loading} label="Login" fullWidth={true} primary={true} onTouchTap={this.doLogin.bind(this)} />
            </CardActions>
          </Card>
        </div>
        {spinner}
      </div>
    );
  }
}

function select(state) {
  return { auth: state.auth };
}

Login.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default withRouter(connect(select)(Login));
