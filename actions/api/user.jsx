import { createAction } from 'redux-act';

export const fetchUsersStart = createAction('Start fetching users from REST API');
export const fetchUsersFail = createAction('Failed to fetch users');
export const fetchUsersSuccess = createAction('Successfully fetched users');
