import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Component, PropTypes } from 'react';
import { AppBar, Divider, Drawer, MenuItem } from 'material-ui';
import { PREFERENCES, USERS, SESSIONS, HOME } from '../constants/Views';
import { withRouter } from 'react-router';

import * as UiActions from '../actions/ui';

class MenuDrawer extends Component {
  changeView(view) {
    this.props.actions.changeView(view)
    this.props.router.push('/' + view.toLowerCase());
    this.props.actions.closeDrawer();
  }

  render() {
    return (
      <Drawer
        open={this.props.drawerOpened}
        docked={false}
        onRequestChange={this.props.actions.closeDrawer} >

        <AppBar title="Navigation"
                onLeftIconButtonTouchTap={this.props.actions.closeDrawer} />

        {[HOME, SESSIONS, USERS].map((row, i) => {
            return(
              <MenuItem
                key={`MenuItem${i}`}
                style={{color: this.props.view === row ? this.context.muiTheme.palette.primary1Color : null}}
                onTouchTap={() => {this.changeView(row)}}>

                {row}
              </MenuItem>
            );
          })
        }

        <Divider />

        <MenuItem
          onTouchTap={() => {this.changeView(PREFERENCES)}}
          style={{color: this.props.view === PREFERENCES ? this.context.muiTheme.palette.primary1Color : null}} >

          Preferences
        </MenuItem>
      </Drawer>
    );
  }
}

MenuDrawer.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    view: state.ui.get('view'),
    drawerOpened: state.ui.get('drawerOpened')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(UiActions, dispatch)
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuDrawer));
