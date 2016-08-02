import { apiReducer, initialState } from '../apiReducer';
import { createReducer } from 'redux-act';
import authActions from '../../actions/api/auth';

export default createReducer(
  apiReducer('/employees/authenticate', authActions, 'POST'),
  initialState()
);
