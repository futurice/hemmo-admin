import { createStore, compose } from 'redux';
import { install } from 'redux-loop';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  const enhancer = compose(
    install(),
    window.devToolsExtension ? window.devToolsExtension() : f => f
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
