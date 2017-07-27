import React from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import { createAction } from 'redux-act';

import FullscreenSpinner from '../components/FullscreenSpinner';

export const reset = createAction('Reset app state');

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  doLogout() {
    dispatch(dispatch(reset()));
  },
  redirect(path) {
    dispatch(replace(path));
  },
});

class Logout extends React.Component {
  componentDidMount() {
    if (!this.props.auth.data.token) {
      this.deauthSuccess();
    } else {
      this.props.doLogout();
    }
  }

  shouldComponentUpdate(props) {
    if (!props.auth.data.token) {
      this.deauthSuccess();
      return false;
    }

    return true;
  }

  deauthSuccess = () => {
    const { redirect } = this.props;

    redirect('/');
  };

  render() {
    return <FullscreenSpinner />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
