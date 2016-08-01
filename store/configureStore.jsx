import { createStore, compose } from 'redux';
import { install } from 'redux-loop';
import rootReducer from '../reducers';

// TODO: dev tools extension
//window.devToolsExtension ? window.devToolsExtension() : undefined

export default function configureStore(initialState) {
  const enhancer = compose(
    install()
  );

  const store = createStore(
    rootReducer,
    initialState,
    enhancer
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
