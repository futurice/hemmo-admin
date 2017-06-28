import { createStore, compose, applyMiddleware } from 'redux';
import { autoRehydrate } from 'redux-persist';

import rootReducer from './reducer';
import middleware from './middleware';
import { injectStore } from './rest';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  undefined,
  composeEnhancers(
    applyMiddleware(...middleware),
    autoRehydrate(),
  ),
);

// this is to get rid of cyclic dependencies
// TODO: better way?
injectStore(store);

export default store;
