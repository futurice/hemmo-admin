import { applyMiddleware } from 'redux';
import { combineReducers } from 'redux-loop';
import { routerReducer } from 'react-router-redux';
import ui from './ui';
import api from './api';

const rootReducer = combineReducers({
  ...api.reducers,
  ui,
  routing: routerReducer
});

export default rootReducer;
