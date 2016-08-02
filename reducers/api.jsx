import { createReducer } from 'redux-act';
import { Effects, loop } from 'redux-loop';
import { Map } from 'immutable';
import fetchUsers from '../actions/api/user';

const API_ROOT = 'http://localhost:3001';
const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6ImZvbyIsInNjb3BlIjoiZW1wbG95ZWUiLCJpYXQiOjE0NzAwNTM4MjYsImV4cCI6MTQ3MDA3MTgyNn0.ESqi4VvLyufkyYep-QwoYJQBffJrrkQfJpnlEDIXn-M'

function fetchApi(path, actions) {
  return fetch(`${API_ROOT}${path}`, {
    headers: new Headers({
      Authorization: `Bearer ${API_TOKEN}`
    })
  })
    .then((r) => (r.json()))
    .then((res) => {
      if (res.ok) {
        return actions.success(res.users);
      } else {
        throw new Error(res.message);
      }
    })
    .catch(actions.fail);
}

const initialState = Map({
  data: [],
  loading: false,
  error: ''
});

function apiReducer(path, actions, method = 'GET', payload) {
  return {
    [actions.start]: (state) => (
      loop(
        state
          .set('loading', true)
          .set('error', false),
        Effects.promise(() => fetchApi(path, actions))
    )),

    [actions.success]: (state, payload) => (
      state
        .set('loading', false)
        .set('data', payload)
    ),

    [actions.fail]: (state, payload) => (
      state
        .set('loading', false)
        .set('error', payload || true)
    )
  };
}

export default createReducer(
  apiReducer('/users', fetchUsers),
  initialState
);
