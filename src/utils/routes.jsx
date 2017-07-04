import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';

/*
Configure all your app's routes here.

The first route will be aliased to '/' (index route)

Each route contains the following keys:
  - path:
    * URL path of route.
  - name:
    * Name of route as displayed in header.
    * Used as i18n id, remember to add translations to translations/*.js
  - component:
    * Which component to render when route is active.
    * Remember to import it below.
  - icon:
    * Which icon to use in NavigationDrawer for route.
    * Takes icon font string as found on: https://material.io/icons
  - requiresLogin:
    * Does the route require user to be authenticated?
    * Redirects to login screen for unauthenticated users.

Routes may optionally contain the following keys:
  - separator:
    * Whether to show a separator in NavigationDrawer below route
  - hideWhenScope:
    * Array of scopes, if user scope found in array hide route from NavigationDrawer.
    * null scope in array means unauthenticated.
*/

// Icons
import HomeIcon from 'material-ui-icons/Home';
import SessionsIcon from 'material-ui-icons/Assessment';
import UsersIcon from 'material-ui-icons/SupervisorAccount';
import PreferencesIcon from 'material-ui-icons/Settings';
import LoginIcon from 'material-ui-icons/AccountCircle';
import LogoutIcon from 'material-ui-icons/ExitToApp';

// Components
import Home from '../modules/Home';
import Sessions from '../modules/Sessions';
import Users from '../modules/Users';
import UserDetail from '../modules/UserDetail';
import Preferences from '../modules/Preferences';
import Login from '../modules/Login';
import Logout from '../modules/Logout';
import NotFound from '../modules/NotFound';

// Routes
const routeConfigs = [{
  path: '/home',
  name: 'Home',
  component: Home,
  icon: HomeIcon,
  requiresLogin: true,
  showInMenu: true
}, {
  path: '/sessions',
  name: 'Feedback',
  component: Sessions,
  icon: SessionsIcon,
  requiresLogin: true,
  showInMenu: true
}, {
  path: '/users/:userId',
  name: 'Child',
  component: UserDetail,
  icon: UsersIcon,
  separator: true,
  requiresLogin: true,
  showInMenu: false
}, {
  path: '/users',
  name: 'Children',
  component: Users,
  icon: UsersIcon,
  separator: true,
  requiresLogin: true,
  showInMenu: true
}, {
  path: '/preferences',
  name: 'Preferences',
  component: Preferences,
  icon: PreferencesIcon,
  requiresLogin: true,
  showInMenu: true
}, {
  path: '/login',
  name: 'Login',
  component: Login,
  icon: LoginIcon,
  requiresLogin: false,
  hideWhenScope: ['employee', 'admin'],
  showInMenu: true
}, {
  path: '/logout',
  name: 'Logout',
  component: Logout,
  icon: LogoutIcon,
  requiresLogin: false,
  hideWhenScope: [null],
  showInMenu: true
}];

export default routeConfigs;

/*
Code below this line configures the routes as given by routeConfigs
*/

// PropTypes "schema" for routeConfig
export const RouteConfigShape = PropTypes.shape({
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired,
  icon: PropTypes.func.isRequired,
  requiresLogin: PropTypes.bool,
  showHeader: PropTypes.bool,
});

const mapStateToProps = state => ({
  loggedIn: !!state.auth.data.token,
});

// Takes a routeConfig and wraps it in react-router's <Route> component.
// If requiresLogin is true, redirect to /login if user has not authenticated

// Must wrap in withRouter here to avoid this:
// https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
@withRouter
@connect(mapStateToProps)
class AuthRedirectRoute extends React.Component {
  static propTypes = {
    loggedIn: PropTypes.bool,
    requiresLogin: PropTypes.bool,
    component: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loggedIn: false,
    requiresLogin: false,
  };

  render() {
    const { component: ChildComponent, loggedIn, requiresLogin, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props => (
          !requiresLogin || loggedIn ? (
            <ChildComponent {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          )
        )}
      />
    );
  }
}

// AuthRedirectRoute wrapper which mounts routeConfig at '/' regardless of configured path
export const IndexRoute = ({ routeConfig, ...rest }) => {
  const indexRoute = {
    ...routeConfig,
    path: '/',
  };

  return (
    <AuthRedirectRoute
      exact
      {...rest}
      {...indexRoute}
    />
  );
};

IndexRoute.propTypes = {
  routeConfig: RouteConfigShape.isRequired,
};

// Map all configured routes into AuthRedirectRoute components
export const ConfiguredRoutes = ({ ...rest }) => (
  <Switch>
    {
      routeConfigs.map(routeConfig => (
        <AuthRedirectRoute
          key={routeConfig.path}
          {...routeConfig}
          {...rest}
        />
      ))
    }
    <Route component={NotFound} />
  </Switch>
);

// Check that routeConfigs array is a valid RouteConfigShape
PropTypes.checkPropTypes({
  routeConfigs: PropTypes.arrayOf(RouteConfigShape).isRequired,
}, { routeConfigs }, 'prop', 'routeConfigs');
