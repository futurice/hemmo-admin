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

import * as UiActions from '../actions/ui';

const muiTheme = getMuiTheme({});

class App extends Component {
  componentWillMount() {
    this.props.router.push('/' + DEFAULT_VIEW.toLowerCase());
  }

  render() {
    const { drawerOpened, view, actions } = this.props;

    return(
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <MenuDrawer
            open={drawerOpened}
            closeDrawer={actions.closeDrawer}
            changeView={actions.changeView}
            activeView={view}
          />
          <Header
            toggleDrawer={actions.toggleDrawer}
            activeView={view}
          />
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  view: PropTypes.string.isRequired,
  drawerOpened: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    view: state.ui.view,
    drawerOpened: state.ui.drawerOpened
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UiActions, dispatch)
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
