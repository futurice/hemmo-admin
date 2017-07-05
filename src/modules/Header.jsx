import React from 'react';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';

import Menu from 'material-ui/Menu';
import { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import MenuIcon from 'material-ui-icons/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';

import { FormattedMessage, injectIntl } from 'react-intl';

import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { toggleDrawer } from './NavigationDrawer';
import routes, { NavigationRoutes } from '../utils/routes';

const getTitle = (path) => {
  if (path === '/') {
    return routes[0].name;
  }

  const foundRoute = routes.find(route => (
    route.path === path ? route.name : null
  ));

  if (foundRoute) {
    return foundRoute.name;
  }
  console.warn(`No title found for path '${path}'`);
  console.warn('Make sure the title name is defined in src/routes.js');
  return `ERROR: Title not found for path: ${path}`;
};


const mapStateToProps = (state, ownProps) => ({
  path: ownProps.location.pathname,
  user: state.auth.data.decoded,
});

const mapDispatchToProps = dispatch => ({
  doToggleDrawer() {
    dispatch(toggleDrawer());
  },
  login() {
    dispatch(push('/login'));
  },
  logout() {
    dispatch(push('/logout'));
  },
  preferences() {
    dispatch(push('/preferences'));
  },
  changeView(view) {
    dispatch(push(view.toLowerCase()));
  }
});

@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class Header extends React.Component {
  static defaultProps = {
    user: null,
  };

  state = {
    rightMenuOpen: false,
    rightMenuAnchorEl: null,
  };

  render() {
    const {
      path,
      doToggleDrawer,
      user,
      login,
      preferences,
      logout,
      changeView,
      intl: { formatMessage },
    } = this.props;

    const {
      rightMenuOpen,
      rightMenuAnchorEl,
    } = this.state;

    const hideMenu = () => this.setState({ rightMenuOpen: false });
    const scope = user ? user.scope : null;
    const navigationRoutes = NavigationRoutes(user, path);

    /*const rightMenu = user ? (
      <Menu
        open={rightMenuOpen}
        anchorEl={rightMenuAnchorEl}
        onRequestClose={() => hideMenu()}
      >
        <ListItem
          button
          onClick={() => { hideMenu(); preferences(); }}
        >
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary={user.email} secondary={`Scope: ${user.scope}`} />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => { hideMenu(); logout(); }}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={formatMessage({ id: 'Logout' })} />
        </ListItem>
      </Menu>
    ) : (
      <Menu
        open={rightMenuOpen}
        anchorEl={rightMenuAnchorEl}
        onRequestClose={() => hideMenu()}
      >
        <ListItem
          button
          onClick={() => { hideMenu(); login(); }}
        >
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary={formatMessage({ id: 'Login' })} />
        </ListItem>
      </Menu>
    );*/

    return (
      <AppBar position="static" >
        <Toolbar>
          <IconButton
            color="contrast"
            onClick={() => doToggleDrawer()}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            style={{ flex: 1 }}
            type="title"
            color="inherit"
          >
            <FormattedMessage id="HemmoAdmin" />
          </Typography>

          {navigationRoutes.map((route, i) => {
            return <Button
              key={i}
              color="contrast"
              className={route.active ? 'active' : ''}
              onClick={() => { changeView(route.path); }}
            >{route.name}</Button>;
          })}
        </Toolbar>
      </AppBar>
    );
  }
}

/*
<IconButton
  color="contrast"
  onClick={e => this.setState({
    rightMenuAnchorEl: e.currentTarget,
    rightMenuOpen: true,
  })}
>
  <MoreVertIcon />
</IconButton>
{ rightMenu }
*/
