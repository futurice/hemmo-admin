import 'isomorphic-fetch';
import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import { logOut } from '../../actions/ui';
import { Map } from 'immutable';

import config from 'config';

export default reduxApi({
  auth: {
    url: `/employees/authenticate`,
    transformer(data) {
      let authSession = JSON.parse(localStorage.getItem('auth'));

      if (data && data.error) {
        console.log('got error from backend');
        return { error: data.error, message: data.message };
      } else if (data) {
        console.log('got new token from backend');

        const { token, employeeId, expiresIn } = data;

        let expiration = new Date();
        let expirationDelta = 1000; // account for possible clock drift, latency...
        expiration.setMilliseconds(expiration.getMilliseconds() + expiresIn - expirationDelta);

        localStorage.setItem('auth', JSON.stringify({
          token,
          employeeId,
          expiration
        }));

        return { token, employeeId, expiration };
      } else if (authSession && authSession.token) {
        console.log('found token in localStorage');

        const { token, employeeId, expiration } = authSession;

        if (!expiration || new Date().getTime() >= new Date(expiration).getTime()) {
          console.log('token in localStorage expired!');
          return {};
        }

        return { token, employeeId, expiration };
      } else {
        console.log('no auth token found');

        return {};
      }
    },
    options: {
      method: 'post'
    },
    reducer(state, action) {
      if (action.type === logOut().type) {
        localStorage.removeItem('auth');
        console.log('removing auth session');

        return { ...state, data: {}};
      }
      return state;
    }
  },
  register: {
    url: `/employees/register`,
    transformer(data) {
      let authSession = JSON.parse(localStorage.getItem('auth'));

      if (data && data.error) {
        console.log('got error from backend');
        return { error: data.error, message: data.message };
      } else if (data) {
        console.log('got new token from backend');

        const { token, employeeId, expiresIn } = data;

        let expiration = new Date();
        let expirationDelta = 1000; // account for possible clock drift, latency...
        expiration.setMilliseconds(expiration.getMilliseconds() + expiresIn - expirationDelta);

        localStorage.setItem('auth', JSON.stringify({
          token,
          employeeId,
          expiration
        }));

        return { token, employeeId, expiration };
      } else {
        console.log('no auth token found');

        return {};
      }
    },
    options: {
      method: 'post'
    }
  },
  users: {
    url: `/users`,
    transformer(data) {
      if (data) {
        return data.users;
      } else {
        return [];
      }
    }
  },
  sessions: {
    url: `/sessions`,
    transformer(data) {
      if (data) {
        return data.sessions;
      } else {
        return [];
      }
    }
  },
  sessionDetail: {
    url: `/sessions/:sessionId`,
    transformer(data) {
      if (data) {
        return data;
      } else {
        return {};
      }
    }
  },
  sessionUpdate: {
    url: `/sessions/:sessionId`,
    transformer(data) {
      if (data) {
        return data;
      } else {
        return null;
      }
    },
    options: {
      method: 'put'
    }
  }
})
.use('options', (url, params, getState) => {
  const token = getState().auth.data.token;

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
.use('rootUrl', config.API_ROOT);
