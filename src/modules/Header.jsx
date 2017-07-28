import React from 'react';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import MenuIcon from 'material-ui-icons/Menu';

import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { toggleDrawer } from './NavigationDrawer';
import { NavigationRoutes } from '../utils/routes';

const mapStateToProps = state => ({
  user: state.auth.data.decoded,
  path:
    state.router && state.router.location
      ? state.router.location.pathname
      : '/',
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
  },
});

@injectIntl
@withRouter
class Header extends React.Component {
  static defaultProps = {
    user: null,
  };

  state = {
    rightMenuOpen: false,
    rightMenuAnchorEl: null,
  };

  render() {
    const { doToggleDrawer, path, user, changeView } = this.props;
    const navigationRoutes = NavigationRoutes(user, path);

    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton color="contrast" onClick={() => doToggleDrawer()}>
            <MenuIcon />
          </IconButton>
          <Typography style={{ flex: 1 }} type="title" color="inherit">
            <FormattedMessage id="HemmoAdmin" />
          </Typography>

          <span className="nav-buttons">
            {navigationRoutes.map((route, i) => {
              return (
                <Button
                  key={i}
                  color="contrast"
                  className={route.active ? 'active' : ''}
                  onClick={() => {
                    changeView(route.path);
                  }}
                >
                  {route.name}
                </Button>
              );
            })}
          </span>
        </Toolbar>
      </AppBar>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
