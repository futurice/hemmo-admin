import React from 'react';
import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import Header from '../components/Header';
import TextField from 'material-ui/TextField';

import CircularProgress from 'material-ui/CircularProgress';
import * as UiActions from '../actions/ui';

class Logout extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(UiActions.logOut());
  }

  render() {
    return(
      <div style={{
        textAlign: 'center',
        margin: this.context.muiTheme.spacing.desktopGutter
      }}>
        <CircularProgress />
      </div>
    );
  }
}

Logout.propTypes = {
  dispatch: PropTypes.func.isRequired
};

Logout.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default withRouter(connect()(Logout));
