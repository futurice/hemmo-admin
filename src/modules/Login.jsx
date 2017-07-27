import React from 'react';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import Card, { CardActions, CardHeader, CardContent } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';

import { LinearProgress } from 'material-ui/Progress';

import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { updateIntl } from 'react-intl-redux';

import CardGridWrapper from '../components/CardGridWrapper';

import { getLocaleForUser, languages } from '../utils/intl';
import rest from '../utils/rest';
import theme from '../utils/theme';

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  redirectPath: ownProps.location.state
    ? ownProps.location.state.from.pathname
    : '/',
});

const mapDispatchToProps = dispatch => ({
  doLogin(creds) {
    dispatch(rest.actions.auth({}, { body: JSON.stringify(creds) }));

    const storedLocale = getLocaleForUser(creds.email);
    if (storedLocale && languages[storedLocale]) {
      dispatch(
        updateIntl({
          locale: storedLocale,
          messages: languages[storedLocale].translations,
        }),
      );
    }
  },
  redirect(path) {
    dispatch(replace(path));
  },
});

class Login extends React.Component {
  state = {
    email: '',
    password: '',
  };

  shouldComponentUpdate(props) {
    if (props.auth.data && props.auth.data.token) {
      this.authSuccess();
      return false;
    }

    return true;
  }

  authSuccess() {
    const { redirect } = this.props;
    let path = this.props.redirectPath;

    if (!path || path === '/logout') {
      path = '/';
    }

    redirect(path);
  }

  handleChange(event, field) {
    this.setState({
      [field]: event.target.value,
    });
  }

  render() {
    const { auth } = this.props;
    const loading = auth.loading;
    const progress = loading ? <LinearProgress /> : null;

    return (
      <CardGridWrapper>
        <Card>
          <CardHeader
            avatar={
              <Avatar style={{ backgroundColor: theme.palette.primary[500] }}>
                <AccountCircleIcon />
              </Avatar>
            }
            title="frontend-kit"
            subheader="Please log in:"
          />
          <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              type="text"
              label="Email"
              onChange={event => {
                if (event.keyCode !== 13) {
                  this.handleChange(event, 'email');
                }
              }}
              onKeyDown={event => {
                if (event.keyCode === 13) {
                  this.props.doLogin({
                    email: this.state.email,
                    password: this.state.password,
                  });
                }
              }}
              inputProps={{
                autoFocus: true,
              }}
              marginForm
            />
            <TextField
              type="password"
              label="Password"
              onChange={event => {
                if (event.keyCode !== 13) {
                  this.handleChange(event, 'password');
                }
              }}
              onKeyDown={event => {
                if (event.keyCode === 13) {
                  this.props.doLogin({
                    email: this.state.email,
                    password: this.state.password,
                  });
                }
              }}
              marginForm
            />
          </CardContent>
          <CardActions
            style={{
              margin: theme.spacing.unit,
              marginTop: '0px',
            }}
          >
            <Button
              raised
              style={{
                width: '100%',
              }}
              color="primary"
              onClick={() =>
                this.props.doLogin({
                  email: this.state.email,
                  password: this.state.password,
                })}
            >
              Login
            </Button>
          </CardActions>
          {progress}
        </Card>
      </CardGridWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
