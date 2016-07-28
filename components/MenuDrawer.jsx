import React from 'react';
import {AppBar, Drawer, MenuItem} from 'material-ui';

class MenuDrawer extends React.Component {
  propTypes: {
    asd: React.PropTypes.func.isRequired,
  }

  setView(view) {
    console.log(this);
    this.props.setView(view)
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
          onTouchTap={() => {this.setView('Sessions')}}
        >
          Sessions
        </MenuItem>

        <MenuItem
          onTouchTap={() => {this.setView('Users')}}
        >
          Users
        </MenuItem>

        <MenuItem
          onTouchTap={() => {this.setView('Preferences')}}
        >
          Preferences
        </MenuItem>
      </Drawer>
    );
  }
}

export default MenuDrawer;
