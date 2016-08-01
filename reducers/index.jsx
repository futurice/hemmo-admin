import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import rest from '../rest';
import ui from './ui';

const rootReducer = combineReducers(Object.assign({
    ui,
    routing: routerReducer
}, rest.reducers));

export default rootReducer;
