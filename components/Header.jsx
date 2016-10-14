import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { PropTypes, Component } from 'react';
import { AppBar, Drawer, MenuItem } from 'material-ui';
import * as UiActions from '../actions/ui';
import { MenuRoutes, MiscRoutes } from '../src/Routes';
import { FormattedMessage } from 'react-intl';

const defaultStyle = {
  marginLeft: 20
};

class Header extends Component {
  toggleDrawer() {
    this.props.actions.toggleDrawer();
  }

  matchMiscRoute(path, params) {
    return MiscRoutes[Object.keys(MiscRoutes).find(route => {
      let replacedRoute = route;

      if (route.indexOf(':' !== -1)) {
        Object.keys(params).forEach(param => {
          replacedRoute = replacedRoute.replace(`:${param}`, params[param]);
        });
      }

      if (replacedRoute === path) {
        return true;
      }
    })];
  }

  getTitle(path, params) {
    return MenuRoutes[path] || this.matchMiscRoute(path, params);
  }

  render() {
    return (
      <header className="header">
        <AppBar title={<FormattedMessage id={this.getTitle(this.props.pathname, this.props.params)} /> }
                onLeftIconButtonTouchTap={() => this.toggleDrawer()}/>
      </header>
    );
  }
}

function mapStateToProps(state, ownProps) {
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
