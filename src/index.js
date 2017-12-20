import 'typeface-roboto';

import Offline from 'offline-plugin/runtime';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';

// import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';

import { IntlProvider } from 'react-intl-redux';

import App from './modules/App';
import FullscreenSpinner from './components/FullscreenSpinner';

import store from './utils/store';
import persistStore from './utils/persist';

import { history } from './utils/middleware/router';
import theme from './utils/theme';

const muiTheme = createMuiTheme(theme);

// Needed for onClick
// http://stackoverflow.com/a/34015469/988941
/*
try {
  injectTapEventPlugin();
} catch (e) {
  // ignore errors
  // otherwise we break hot reloading
}
*/

// offline-plugin: Apply updates immediately
// https://github.com/NekR/offline-plugin/blob/master/docs/updates.md
if (process.env.NODE_ENV === 'production') {
  Offline.install({
    onUpdating: () => {
      // console.log('SW Event:', 'onUpdating');
    },

    onUpdateReady: () => {
      // console.log('SW Event:', 'onUpdateReady');
      // Tells to new SW to take control immediately
      Offline.applyUpdate();
    },

    onUpdated: () => {
      // console.log('SW Event:', 'onUpdated');
      // Reload the webpage to load into the new version
      window.location.reload();
    },

    onUpdateFailed: () => {
      // TODO: alert user
      // console.log('SW Event:', 'onUpdateFailed');
    },
  });
}

export default class Root extends React.Component {
  state = { rehydrated: false };

  componentWillMount() {
    persistStore(store, () => this.setState({ rehydrated: true }));
  }

  renderLoading = () => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FullscreenSpinner />
    </div>
  );

  render() {
    const { rehydrated } = this.state;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Provider store={store}>
          <IntlProvider>
            <ConnectedRouter history={history}>
              {rehydrated ? <App /> : this.renderLoading()}
            </ConnectedRouter>
          </IntlProvider>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

render(<Root />, document.getElementById('root'));
