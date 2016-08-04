import React from 'react';
import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { DEFAULT_VIEW } from '../constants/Views';

import RaisedButton from 'material-ui/RaisedButton';
import MenuDrawer from '../components/MenuDrawer';
import Header from '../components/Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.checkLogin = this.checkLogin.bind(this);
  }

  checkLogin() {
    let token = this.props.auth.data.get('token');

    if (!token) {
      this.props.router.push('/login');
      return false;
    }

    return true;
  }

  componentWillMount() {
    this.checkLogin();
  }

  shouldComponentUpdate(props) {
    return this.checkLogin();
  }

  render() {
    return(
      <div>
        <MenuDrawer/>
        <Header/>
        {this.props.children}
      </div>
    );
  }
}

function select(state) {
  return { auth: state.auth };
}

export default withRouter(connect(select)(App));
