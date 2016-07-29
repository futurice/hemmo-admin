import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';

import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import App from '../containers/App';

import Sessions from '../routes/Sessions';
import Users from '../routes/Users';
import Preferences from '../routes/Preferences';

import configureStore from '../store/configureStore';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

//Needed for React Developer Tools
window.React = React;

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="sessions" component={Sessions}/>
        <Route path="users" component={Users}/>
        <Route path="preferences" component={Preferences}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById("root")
);
