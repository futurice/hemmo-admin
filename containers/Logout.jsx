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

class Logout extends Component {
  constructor(props) {
    super(props);
    localStorage.removeItem('auth');
    this.props.router.push('/login');
  }

  render() {
    return(
      <CircularProgress />
    );
  }
}

export default withRouter(connect()(Logout));
