import { Effects, loop } from 'redux-loop';
import { Map } from 'immutable';
import { Promise } from 'bluebird';

const PORT = 3001;
const API_ROOT = window.location.protocol + '//' + window.location.hostname + ':' + PORT;

function fetchApi(path, actions, method = 'GET', body) {
  let API_TOKEN = '';

  // TODO: this needs a better solution
  let auth = JSON.parse(localStorage.getItem('auth'));
  if (auth) {
    API_TOKEN = auth.token;
  }

  return fetch(`${API_ROOT}${path}`, {
    method,
    body: JSON.stringify(body),
    headers: new Headers({
      Authorization: `Bearer ${API_TOKEN}`
    })
  })
  .then((res) => {
    if (res.status >= 200 && res.status < 300) {
      return Promise.resolve(res);
    } else {
      return Promise.reject(new Error(res.statusText));
    }
  })
  .then((res) => (res.json()))
  .then((res) => {
    return actions.success(res);
  })
  .catch(actions.fail);
}

export function initialState() {
  return Map({
    data: [],
    loading: false,
    error: ''
  });
}

export function apiReducer(path, actions, method = 'GET') {
  return {
    [actions.start]: (state, payload) => (
      loop(
        state
          .set('loading', true)
          .set('error', ''),
        Effects.promise(() => fetchApi(path, actions, method, payload))
    )),

    [actions.success]: (state, payload) => (
      state
        .set('loading', false)
        .set('data', payload)
    ),

    [actions.fail]: (state, payload) => (
      state
        .set('loading', false)
        .set('error', payload || 'Unknown error')
    )
  };
}
