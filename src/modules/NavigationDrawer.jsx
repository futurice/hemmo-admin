import React from 'react';

import { FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

import Drawer from 'material-ui/Drawer';

import List, {
  ListItem,
  ListItemText,
  ListItemIcon,
} from 'material-ui/List';

import {
  createAction,
  createReducer,
} from 'redux-act';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import routes from '../utils/routes';
import theme from '../utils/theme';

// Action creators
export const closeDrawer = createAction('Close menu drawer');
export const openDrawer = createAction('Open menu drawer');
export const toggleDrawer = createAction('Toggle menu drawer');

// Initial state
const initialState = {
  drawerOpened: false,
};

// Reducer
export const reducer = createReducer({
  [closeDrawer]: state => ({
    ...state,
    drawerOpened: false,
  }),
  [openDrawer]: state => ({
    ...state,
    drawerOpened: true,
  }),
  [toggleDrawer]: state => ({
    ...state,
    drawerOpened: !state.drawerOpened,
  }),
}, initialState);

const mapStateToProps = (state, ownProps) => ({
  drawerOpened: state.drawer.drawerOpened,
  path: ownProps.location.pathname,
  user: state.auth.data.decoded,
});

const mapDispatchToProps = dispatch => ({
  changeView(view) {
    dispatch(closeDrawer());
    dispatch(push(view.toLowerCase()));
  },
  close() {
    dispatch(closeDrawer());
  },
});

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class NavigationDrawer extends React.Component {
  static defaultProps = {
    user: null,
  };

  render() {
    const { close, changeView, drawerOpened, path, user } = this.props;

    return (
      <Drawer
        open={drawerOpened}
        onRequestClose={() => close()}
      >
        <AppBar position="static">
          <Toolbar>
            <IconButton
              color="contrast"
              onClick={() => close()}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              style={{ flex: 1 }}
              type="title"
              color="inherit"
            >
              <FormattedMessage id="navigation" />
            </Typography>
          </Toolbar>
        </AppBar>

        <List>
          {
            routes.map((route) => {
              let active = (path === route.path);

              if (route.path === routes[0].path && path === '/') {
                active = true;
              }

              const scope = user ? user.scope : null;
              const Icon = route.icon;

              if (Array.isArray(route.hideWhenScope) && route.hideWhenScope.includes(scope)) {
                return null;
              }

              return (
                <div key={route.path}>
                  <ListItem
                    button
                    divider={route.separator}
                    onClick={() => { changeView(route.path); }}
                  >
                    <ListItemIcon
                      style={active ? { color: theme.palette.primary[500] } : null}
                    >
                      <Icon />
                    </ListItemIcon>

                    <ListItemText
                      style={active ? { color: theme.palette.primary[500] } : null}
                      primary={<FormattedMessage id={route.name} />}
                    />
                  </ListItem>
                </div>
              );
            })
          }
        </List>
      </Drawer>
    );
  }
}
