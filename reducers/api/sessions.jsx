import { apiReducer, initialState } from '../apiReducer';
import { createReducer } from 'redux-act';
import fetchSessions from '../../actions/api/sessions';

export default createReducer(
  apiReducer('/sessions/', fetchSessions),
  initialState()
);
