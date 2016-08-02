import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';

import { Router, Route, browserHistory, Redirect } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import App from '../containers/App';

import Home from '../components/Home';
import Sessions from '../components/Sessions';
import Users from '../components/Users';
import Preferences from '../components/Preferences';

import configureStore from '../store/configureStore';

import { DEFAULT_VIEW } from '../constants/Views';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

//Needed for React Developer Tools
window.React = React;

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Redirect from='/' to={`/${DEFAULT_VIEW}`.toLowerCase()} />
      <Route path='/' component={App}>
        <Route path='home' component={Home}/>
        <Route path='sessions' component={Sessions}/>
        <Route path='users' component={Users}/>
        <Route path='preferences' component={Preferences}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById("root")
);
