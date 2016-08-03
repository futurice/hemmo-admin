import { apiReducer, initialState } from '../apiReducer';
import { createReducer } from 'redux-act';
import fetchSession from '../../actions/api/sessionsDetail';


export default createReducer(
  apiReducer('/sessions/6e1054bd-0c85-4a48-9c64-89466ed4d8ba', fetchSession, 'GET'),
  initialState()
);
