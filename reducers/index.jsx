import { applyMiddleware } from 'redux';
import { combineReducers } from 'redux-loop';
import { routerReducer } from 'react-router-redux';
import ui from './ui';
import api from './api';

const appReducer = combineReducers({
  ...api.reducers,
  ui,
  routing: routerReducer
})

const rootReducer = (state, action) => {
  if (action.payload && action.payload.pathname === '/logout') {
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer;
