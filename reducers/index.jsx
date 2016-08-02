import { combineReducers } from 'redux-loop';
import { routerReducer } from 'react-router-redux';
import ui from './ui';
import usersApi from './api/users';
import authApi from './api/auth';

const rootReducer = combineReducers({
    ui,
    routing: routerReducer,
    usersApi,
    authApi
});

export default rootReducer;
