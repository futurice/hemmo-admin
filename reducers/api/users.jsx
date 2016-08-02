import { apiReducer, initialState } from '../apiReducer';
import { createReducer } from 'redux-act';
import fetchUsers from '../../actions/api/users';

export default createReducer(
  apiReducer('/users/', fetchUsers),
  initialState()
);
