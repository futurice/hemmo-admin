import { createReducer } from 'redux-act';
import { Effects, loop } from 'redux-loop';
import { Map } from 'immutable';
import * as Actions from '../actions/api/user';

const API_ROOT = 'http://localhost:3001';
const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6ImZvbyIsInNjb3BlIjoiZW1wbG95ZWUiLCJpYXQiOjE0NzAwNTM4MjYsImV4cCI6MTQ3MDA3MTgyNn0.ESqi4VvLyufkyYep-QwoYJQBffJrrkQfJpnlEDIXn-M'

function fetchUsers() {
  return fetch(`${API_ROOT}/users`, {
    headers: new Headers({
      Authorization: `Bearer ${API_TOKEN}`
    })
  })
    .then((r) => (r.json()))
    .then((res) => {
      if (res.ok) {
        return Actions.fetchUsersSuccess(res.users);
      } else {
        throw new Error(res.message);
      }
    })
    .catch(Actions.fetchUsersFail);
}

const initialState = Map({
  data: [],
  loading: false,
  error: ''
});

export default createReducer({
  [Actions.fetchUsersStart]: state => (
    loop(
      state
        .set('loading', true)
        .set('error', false),
      Effects.promise(fetchUsers)
  )),

  [Actions.fetchUsersSuccess]: (state, payload) => (
    state
      .set('loading', false)
      .set('data', payload)
  ),

  [Actions.fetchUsersFail]: (state, payload) => (
    state
      .set('loading', false)
      .set('error', payload || true)
  )
}, initialState);
