import 'isomorphic-fetch';
import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import { logOut } from '../../actions/ui';
import { Map } from 'immutable';

const PORT = 3001;
const API_ROOT = window.location.protocol + '//' + window.location.hostname + ':' + PORT;

export default reduxApi({
  auth: {
    url: `${API_ROOT}/employees/authenticate/`,
    transformer(data) {
      let authSession = JSON.parse(localStorage.getItem('auth'));

      if (data) {
        console.log('got data');
        console.log(data);
        const { token, employeeId } = data;
        localStorage.setItem('auth', JSON.stringify({ token, employeeId }));

        return Map({ auth: true, token, employeeId });
      } else if (authSession) {
        const { token, employeeId } = authSession;
        console.log(token, employeeId);

        return Map({ auth: true, token, employeeId });
      } else {
        console.log('no auth session');

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
    url: `${API_ROOT}/users/`,
    prefetch: [
      function ({actions, dispatch}, cb) {
        dispatch(actions.auth.sync(cb));
      },
      function ({getState}, cb) {
        console.log(getState());
        const { users: { data: { auth }}} = getState();
        console.log(auth);

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
