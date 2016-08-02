import { createAction } from 'redux-act';

export default {
  start:   createAction('Start fetching users from REST API'),
  fail:    createAction('Failed to fetch users'),
  success: createAction('Successfully fetched users')
};
