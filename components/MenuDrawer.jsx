import { Component, PropTypes } from 'react';
import { AppBar, Divider, Drawer, MenuItem } from 'material-ui';
import { PREFERENCES, USERS, SESSIONS, HOME } from '../constants/Views';
import { withRouter } from 'react-router';

class MenuDrawer extends Component {
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
          onTouchTap={() => {this.changeView(HOME)}}
          style={this.props.activeView === HOME ? { color: 'rgb(0, 188, 212)' } : null}
        >
          Home
        </MenuItem>

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

        <Divider />

        <MenuItem
          onTouchTap={() => {this.changeView(PREFERENCES)}}
          style={this.props.activeView === PREFERENCES ? { color: this.context.muiTheme.palette.primary1Color } : null}
        >
          Preferences
        </MenuItem>
      </Drawer>
    );
  }
}

MenuDrawer.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default withRouter(MenuDrawer);
