import { createAction } from 'redux-act';

export default {
  start:   createAction('Start fetching attachment from REST API'),
  fail:    createAction('Failed to fetch attachment'),
  success: createAction('Successfully fetched attachment')
};
