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

export default withRouter(App);
