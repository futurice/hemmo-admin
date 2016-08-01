import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { PropTypes, Component } from 'react';
import { AppBar, Drawer, MenuItem } from 'material-ui';
import * as UiActions from '../actions/ui';

const defaultStyle = {
  marginLeft: 20
};

class Header extends Component {
  toggleDrawer() {
    this.props.actions.toggleDrawer();
  }

  render() {
    return (
      <header className="header">
        <AppBar title={this.props.view}
                onLeftIconButtonTouchTap={() => this.toggleDrawer()}/>
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    view: state.ui.get('view')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UiActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
