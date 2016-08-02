import { createAction } from 'redux-act';

export default {
  start:   createAction('Start fetching sessions from REST API'),
  fail:    createAction('Failed to fetch sessions'),
  success: createAction('Successfully fetched sessions')
};
