import { combineReducers } from 'redux-loop';
import { routerReducer } from 'react-router-redux';
import ui from './ui';
import apiReducer from './api';

const rootReducer = combineReducers({
    ui,
    routing: routerReducer,
    api: apiReducer
});

export default rootReducer;
