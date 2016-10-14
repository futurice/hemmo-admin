import { applyMiddleware } from 'redux';
import { combineReducers } from 'redux-loop';
import { routerReducer } from 'react-router-redux';
import { logOut } from '../actions/ui';
import ui from './ui';
import api from './api';
import {Provider, intlReducer} from 'react-intl-redux'

const appReducer = combineReducers({
  ...api.reducers,
  ui,
  routing: routerReducer,
  intl: intlReducer
})

const rootReducer = (state, action) => {
  if (action.type === logOut().type) {
    console.log('wiping state');
    state = undefined;
  }
  return appReducer(state, action)
}

export default rootReducer;
