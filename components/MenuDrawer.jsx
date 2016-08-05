import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Component, PropTypes } from 'react';
import { AppBar, Divider, Drawer, MenuItem } from 'material-ui';
import { PREFERENCES, USERS, SESSIONS, HOME, LOGOUT } from '../constants/Views';
import { push } from 'react-router-redux'

import * as UiActions from '../actions/ui';

class MenuDrawer extends Component {
  changeView(view) {
    //this.props.actions.changeView(view)
    this.props.dispatch(UiActions.changeView(view));
    this.props.dispatch(UiActions.closeDrawer());
    this.props.dispatch(push('/' + view.toLowerCase()));
  }

  render() {
    return (
      <Drawer
        open={this.props.drawerOpened}
        docked={false}
        onRequestChange={() => this.props.dispatch(UiActions.closeDrawer())} >

        <AppBar title="Navigation"
                onLeftIconButtonTouchTap={() => this.props.dispatch(UiActions.closeDrawer())} />

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

        <MenuItem
          onTouchTap={() => {
            this.props.dispatch(UiActions.logOut()); this.props.dispatch(UiActions.closeDrawer());
          }} >
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
