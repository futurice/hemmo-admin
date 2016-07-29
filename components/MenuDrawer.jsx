import React from 'react';
import {AppBar, Drawer, MenuItem} from 'material-ui';
import { PREFERENCES, USERS, SESSIONS } from '../constants/Views';

class MenuDrawer extends React.Component {
  changeView(view) {
    this.props.changeView(view)
    this.props.closeDrawer();
  }

  render() {
    return (
      <Drawer
        open={this.props.open}
        docked={false}
        onRequestChange={this.props.closeDrawer}
      >
        <AppBar title="Navigation"
                onLeftIconButtonTouchTap={this.props.closeDrawer}
        />

        <MenuItem
          onTouchTap={() => {this.changeView(SESSIONS)}}
        >
          Sessions
        </MenuItem>

        <MenuItem
          onTouchTap={() => {this.changeView(USERS)}}
        >
          Users
        </MenuItem>

        <MenuItem
          onTouchTap={() => {this.changeView(PREFERENCES)}}
        >
          Preferences
        </MenuItem>
      </Drawer>
    );
  }
}

export default MenuDrawer;
