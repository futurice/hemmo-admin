import React from 'react';
import { connect } from 'react-redux';

import { withRouter } from 'react-router';
import NavigationDrawer from './NavigationDrawer';
import Header from './Header';
import { ConfiguredRoutes } from '../utils/routes';
import ErrorSnackbar from './ErrorSnackbar';

import { updateIntl } from 'react-intl-redux';
import { getLocaleForUser, languages } from '../utils/intl';

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  setLocale: auth => {
    // Updates i18n messages for logged in users on app start
    if (!auth.data.decoded) {
      // User not logged in? Don't do anything here
      return;
    }

    const storedLocale = getLocaleForUser(auth.data.decoded.email);
    if (storedLocale && languages[storedLocale]) {
      dispatch(
        updateIntl({
          locale: storedLocale,
          messages: languages[storedLocale].translations,
        }),
      );
    }
  },
});

export class App extends React.Component {
  componentDidMount = () => {
    this.props.setLocale(this.props.auth);
  };

  render = () => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavigationDrawer />
      <Header />

      <div className="content-wrapper">
        <ConfiguredRoutes />
      </div>

      <ErrorSnackbar />
    </div>
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
