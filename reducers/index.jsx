import { combineReducers } from 'redux-loop';
import { routerReducer } from 'react-router-redux';
import ui from './ui';
import usersApi from './api/users';
import sessionsApi from './api/sessions';
import sessionDetailApi from './api/sessionsDetail';
import attachmentApi from './api/attachment';
import authApi from './api/auth';

const rootReducer = combineReducers({
    ui,
    routing: routerReducer,
    usersApi,
    sessionsApi,
    sessionDetailApi,
    attachmentApi,
    authApi
});

export default rootReducer;
