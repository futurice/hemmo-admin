import 'isomorphic-fetch';
import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import { logOut } from '../../actions/ui';
import { Map } from 'immutable';

const PORT = 3001;
const API_ROOT = window.location.protocol + '//' + window.location.hostname + ':' + PORT;

export default reduxApi({
  auth: {
    url: `/employees/authenticate/`,
    transformer(data) {
      let authSession = JSON.parse(localStorage.getItem('auth'));

      if (data) {
        console.log('got new token from backend');

        const { token, employeeId } = data;
        localStorage.setItem('auth', JSON.stringify({ token, employeeId }));

        return Map({ auth: true, token, employeeId });
      } else if (authSession && authSession.token) {
        console.log('found token in localStorage');

        const { token, employeeId } = authSession;

        return Map({ auth: true, token, employeeId });
      } else {
        console.log('no auth token found');

        return Map({ auth: false, token: '', employeeId: '' });
      }
    },
    options: {
      method: 'post'
    },
    reducer(state, action) {
      if (action.type === logOut().type) {
        localStorage.removeItem('auth');
        console.log('removing auth session');

        return { ...state, data: Map({ auth: false, token: '', employeeId: '' })};
      }
      return state;
    }
  },
  users: {
    url: `/users/`,
    transformer(data) {
      if (data) {
        return data.users;
      } else {
        return [];
      }
    },
    prefetch: [
      function ({getState}, cb) {
        const token = getState().auth.data.get('token');
        token ? cb() : cb(new Error("Unauthorized"));
      }
    ]
  },
  sessions: {
    url: `/sessions/`
  }
})
.use('options', (url, params, getState) => {
  const token = getState().auth.data.get('token');

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
})
.use('fetch', adapterFetch(fetch))
.use('rootUrl', API_ROOT);
