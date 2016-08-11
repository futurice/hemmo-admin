import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import React, { Component, PropTypes } from 'react';
import { AppBar, Divider, Drawer, MenuItem } from 'material-ui';
import { push } from 'react-router-redux'
import { MenuRoutes } from '../src/Routes';

import * as UiActions from '../actions/ui';
import Home from 'material-ui/svg-icons/action/home';
import Sessions from 'material-ui/svg-icons/action/assessment';
import Users from 'material-ui/svg-icons/action/supervisor-account';
import Preferences from 'material-ui/svg-icons/action/settings';
import Logout from 'material-ui/svg-icons/action/exit-to-app';

let icons = {
  Home,
  Sessions,
  Users,
  Preferences,
  Logout
}

class MenuDrawer extends Component {
  changeView(view) {
    //this.props.actions.changeView(view)
    this.props.dispatch(UiActions.closeDrawer());
    this.props.dispatch(push(view.toLowerCase()));
  }

  onChange(open) {
    this.props.dispatch(UiActions.toggleDrawer());
  }

  render() {
    return (
      <Drawer
        open={this.props.drawerOpened}
        docked={false}
        onRequestChange={() => this.onChange()} >

        <AppBar title="Navigation"
                onLeftIconButtonTouchTap={() => this.props.dispatch(UiActions.closeDrawer())} />

        {Object.keys(MenuRoutes).map((path, i) => {
            return(
              <MenuItem
                leftIcon={React.createElement(icons[MenuRoutes[path]])}
                key={`MenuItem${i}`}
                style={{color: this.props.pathname === path ? this.context.muiTheme.palette.primary1Color : null}}
                onTouchTap={() => {this.changeView(path)}}>

                {MenuRoutes[path]}
              </MenuItem>
            );
          })
        }

        <Divider />

        <MenuItem
          leftIcon={<Preferences/>}
          onTouchTap={() => {this.changeView('/preferences')}}
          style={{color: this.props.pathname === '/preferences' ? this.context.muiTheme.palette.primary1Color : null}} >

          Preferences
        </MenuItem>

        <MenuItem
          leftIcon={<Logout/>}
          onTouchTap={() => { this.changeView('/logout'); }} >
          Logout
        </MenuItem>
      </Drawer>
    );
  }
}

MenuDrawer.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

function select(state, ownProps) {
  return {
    view: state.ui.get('view'),
    drawerOpened: state.ui.get('drawerOpened')
  };
}

export default connect(select)(MenuDrawer);
