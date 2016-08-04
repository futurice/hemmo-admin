import 'isomorphic-fetch';
import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import { Map } from 'immutable';

const PORT = 3001;
const API_ROOT = window.location.protocol + '//' + window.location.hostname + ':' + PORT;

export default reduxApi({
  auth: {
    url: `${API_ROOT}/employees/authenticate/`,
    transformer(data) {
      if (data) {
        console.log('got data');
        console.log(data);
        const { token, employeeId } = data;
        return Map({ auth: true, token, employeeId });
        localStorage.setItem('auth', { token, employeeId });
      } else {
        const { token, employeeId } = localStorage.getItem('auth');
        console.log(token, employeeId);

        if (token) {
          return Map({ auth: true, token, employeeId });
        } else {
          return Map({ auth: false, token: '', employeeId: '' });
        }
      }
    },
    options: {
      method: 'post'
    }
  },
  users: {
    url: `${API_ROOT}/users/`,
    prefetch: [
      function ({actions, dispatch}, cb) {
        dispatch(actions.auth.sync(cb));
      },
      function ({getState}, cb) {
        const { user: { data: { auth }}} = getState();

        auth ? cb() : cb(new Error("Unauthorized"));
      }
    ]
  },
  sessions: {
    url: `${API_ROOT}/sessions/`
  }
}).use('options', (url, params, getState) => {
  const { auth: { data: { token }}} = getState();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  if (token) {
    return {
      headers: {
        ...headers,
        'Authorization': `Bearer ${token}`
      }
    };
  }

  return {
    headers
  };
}).use('fetch', adapterFetch(fetch));
