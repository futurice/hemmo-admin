import { apiReducer, initialState } from '../apiReducer';
import { createReducer } from 'redux-act';
import fetchAttachment from '../../actions/api/attachment';


export default createReducer(
  apiReducer('/attachment/da9a45a5-360b-4cba-8ab0-5d0e24d6251b', fetchAttachment, 'GET'),
  initialState()
);
