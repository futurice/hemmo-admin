import { apiReducer, initialState } from '../apiReducer';
import { createReducer } from 'redux-act';
import fetchSession from '../../actions/api/sessionsDetail';


export default createReducer(
  apiReducer('/sessions/4c114a7b-e68a-4cde-9825-4fb756b9ef91', fetchSession, 'GET'),
  initialState()
);
