import { createAction } from 'redux-act';

export default {
  start:   createAction('Start fetching session data from REST API'),
  fail:    createAction('Failed to fetch session data'),
  success: createAction('Successfully fetched session data')
};
