import React from 'react';
import {AppBar, Drawer, MenuItem} from 'material-ui';
import { PREFERENCES, USERS, SESSIONS } from '../constants/Views';
import { withRouter } from 'react-router';

class MenuDrawer extends React.Component {
  changeView(view) {
    this.props.changeView(view)
    this.props.router.push('/' + view.toLowerCase());
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
          style={this.props.activeView === SESSIONS ? { color: 'rgb(0, 188, 212)' } : null}
        >
          Sessions
        </MenuItem>

        <MenuItem
          onTouchTap={() => {this.changeView(USERS)}}
          style={this.props.activeView === USERS ? { color: 'rgb(0, 188, 212)' } : null}
        >
          Users
        </MenuItem>

        <MenuItem
          onTouchTap={() => {this.changeView(PREFERENCES)}}
          style={this.props.activeView === PREFERENCES ? { color: 'rgb(0, 188, 212)' } : null}
        >
          Preferences
        </MenuItem>
      </Drawer>
    );
  }
}

export default withRouter(MenuDrawer);
