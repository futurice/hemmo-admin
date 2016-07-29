import React, { PropTypes, Component } from 'react';
import {AppBar, Drawer, MenuItem} from 'material-ui';

const defaultStyle = {
  marginLeft: 20
};

class Header extends Component {
  propTypes: {
    toggleDrawer: React.PropTypes.func.isRequired,
  }

  render() {
    return (
      <header className="header">
        <AppBar title={this.props.activeView}
                onLeftIconButtonTouchTap={this.props.toggleDrawer}/>
      </header>
    );
  }
}

export default Header;
