import React from 'react';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
//import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';

//import Menu from 'material-ui/Menu';
//import { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
//import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import MenuIcon from 'material-ui-icons/Menu';
//import MoreVertIcon from 'material-ui-icons/MoreVert';
//import AccountCircleIcon from 'material-ui-icons/AccountCircle';

import { FormattedMessage, injectIntl } from 'react-intl';

import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { toggleDrawer } from './NavigationDrawer';
import { NavigationRoutes } from '../utils/routes';

const mapStateToProps = state => ({
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
  },
});

@withRouter
@injectIntl
class Header extends React.Component {
  static defaultProps = {
    user: null,
  };

  state = {
    rightMenuOpen: false,
    rightMenuAnchorEl: null,
  };

  render() {
    const { doToggleDrawer, user, changeView } = this.props;
    const path = this.props.location.pathname;
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
