import { createAction } from 'redux-act';

export default {
  start:   createAction('Start login'),
  fail:    createAction('Failed to login'),
  success: createAction('Successfully logged in')
}
