import React from "react";
import ReactDOM from "react-dom";

import {IntlProvider, addLocaleData} from 'react-intl';
import localeEn from 'react-intl/locale-data/en';
import localeFi from 'react-intl/locale-data/fi';

import {Provider} from 'react-redux';
import en from '../translations/en';
import fi from '../translations/fi';

addLocaleData([...localeEn, ...localeFi]);
const translations = {
  en,
  fi
}

let storedLocale = localStorage.locale;
const language = storedLocale ||
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

//const language = 'fi';
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
const messages = translations[languageWithoutRegionCode] || translations[language] || translations['en'];

import {
  Router,
  Route,
  browserHistory,
  IndexRoute,
  Redirect,
  NotFoundRoute
} from 'react-router'

import {
  syncHistoryWithStore,
  routerReducer,
  routerActions
} from 'react-router-redux'

import { UserAuthWrapper } from 'redux-auth-wrapper'

import App from '../containers/App';
import Login from '../containers/Login';
import Register from '../containers/Register';
import Logout from '../containers/Logout';

import Home from '../components/Home';
import Sessions from '../components/Sessions/SessionTable';
import Users from '../components/Users/UserTable';
import Preferences from '../components/Preferences';
import SessionDetail from '../components/SessionDetail';
import UserDetail from '../components/UserDetail';

import configureStore from '../store/configureStore';

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
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <IntlProvider
        locale={language}
        key={language}
        messages={messages}
      >
        <Router history={history}>
          <Route path='/login' component={Login}/>
          <Route path='/register' component={Register}/>
          <Route path='/' component={requireAuthentication(App)}>
            <IndexRoute component={Home}/>
            <Redirect from='/home' to='/' />
            <Route path='/sessions' component={Sessions}/>
            <Route path='/sessions/:id' component={SessionDetail}/>
            <Route path='/users/:id' component={UserDetail}/>
            <Route path='/users' component={Users}/>
            <Route path='/preferences' component={Preferences}/>
            <Route path='/logout' component={Logout}/>
          </Route>
          <Redirect from='*' to='/' />
        </Router>
      </IntlProvider>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
