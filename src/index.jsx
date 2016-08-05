import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';

import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerActions } from 'react-router-redux'
import { UserAuthWrapper } from 'redux-auth-wrapper'

import App from '../containers/App';
import Login from '../containers/Login';
import Logout from '../containers/Logout';

import Home from '../components/Home';
import Sessions from '../components/Sessions';
import Users from '../components/Users';
import Preferences from '../components/Preferences';
import SessionDetail from '../components/SessionDetail';

import configureStore from '../store/configureStore';

import { DEFAULT_VIEW } from '../constants/Views';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import theme from './material_ui_raw_theme_file';
const muiTheme = getMuiTheme(theme);

//Needed for React Developer Tools
window.React = React;

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);

const requireAuthentication = UserAuthWrapper({
  authSelector: state => state.auth.data,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'requireAuthentication'
})

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={history}>
        <Route path='/login' component={Login}/>
        <Route path='/' component={requireAuthentication(App)}>
          <IndexRoute component={Home}/>
          <Redirect from='home' to='/' />
          <Route path='sessions' component={Sessions}/>
          <Route path='sessions/:id' component={SessionDetail}/>
          <Route path='users' component={Users}/>
          <Route path='preferences' component={Preferences}/>
          <Route path='logout' component={Logout}/>
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);
