import React from 'react';
import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { DEFAULT_VIEW } from '../constants/Views';

import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MenuDrawer from '../components/MenuDrawer';
import Header from '../components/Header';

const muiTheme = getMuiTheme({});

class App extends Component {
  componentWillMount() {
    this.props.router.push('/' + DEFAULT_VIEW.toLowerCase());
  }

  render() {
    return(
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <MenuDrawer/>
          <Header/>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(App);
