import 'isomorphic-fetch';
import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import { logOut } from '../../actions/ui';
import { Map } from 'immutable';

import { replace } from 'react-router-redux'

import config from 'config';

export default reduxApi({
  auth: {
    url: `/employees/authenticate`,
    reducerName: 'auth',
    transformer(data) {
      let authSession = JSON.parse(localStorage.getItem('auth'));

      if (data && data.error) {
        console.log('Got error from backend: ' + JSON.stringify(data));
        return { error: data.error, message: data.message };
      } else if (data && data.token) {
        // got new token
        console.log('got new token from backend');

        const { token, employeeId, expiresIn } = data;

        let expiration = new Date();
        let expirationDelta = 1000; // account for possible clock drift, latency...
        expiration.setMilliseconds(expiration.getMilliseconds() + expiresIn - expirationDelta);

        document.cookie = `token=${token}`;

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

        return data;
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
  renewAuth: {
    url: `/employees/renewauth`,
    reducerName: 'auth',
    options: {
      method: 'post'
    },
    transformer(data) {
      if (data && data.error) {
        console.log('Got error from backend: ' + JSON.stringify(data));
        return { error: data.error, message: data.message };
      } else if (data && data.token) {
        // got new token
        const { token, employeeId, expiresIn } = data;
        console.log('refreshed new token from backend');

        let expiration = new Date();
        let expirationDelta = 1000; // account for possible clock drift, latency...
        expiration.setMilliseconds(expiration.getMilliseconds() + expiresIn - expirationDelta);

        document.cookie = `token=${token}`;

        localStorage.setItem('auth', JSON.stringify({
          token,
          employeeId,
          expiration
        }));

        return { token, employeeId, expiration };
      } else {
        return data;
      }
    },
    postfetch: [
      ({data, actions, dispatch, getState, request}) => {
        if (!data.token) {
          console.log('Error while renewing auth token, redirecting to login...');
          console.log(data);
          let redirect = '/login';
          dispatch(replace(redirect));
        }
      }
    ]
  },
  register: {
    url: `/employees/register`,
    transformer(data) {
      if (data && data.error) {
        console.log('got error from backend');
        return { error: data.error, message: data.message };
      } else if (data && data.token) {
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

        return data;
      }
    },
    options: {
      method: 'post'
    }
  },
  employees: {
    url: `/employees`,
    transformer(data) {
      if (data) {
        return data.employees;
      } else {
        return [];
      }
    }
  },
  employeePassword: {
    url: `/employees/password`,
    options: {
      method: 'post'
    }
  },
  employeeVerify: {
    url: `/employees/verify/:employeeId`,
    options: {
      method: 'post'
    }
  },
  employeeDetail: {
    url: `/employees/:id`,
    transformer(data, prevData) {
      if (data) {
        return {...prevData, ...data};
      } else {
        return {...prevData};
      }
    },
    crud: true
  },
  users: {
    url: `/users`,
    transformer(data, prevData = {
      entries: [],
      totalEntries: 0,
      name: 'Children'
    }, action) {
      if (data) {
        return {
          ...prevData,
          ...data,
          entries: data.users || [],
          totalEntries: data.count || 0
        };
      } else {
        return {
          ...prevData
        };
      }
    }
  },
  userDetail: {
    url: `/users/:id`,
    transformer(data, prevData) {
      if (data) {
        return {...prevData, ...data};
      } else {
        return {...prevData};
      }
    },
    crud: true
  },
  setUserAssignee: {
    url: `/users/:userId`,
    transformer(data) {
      if (data) {
        return data;
      } else {
        return {};
      }
    },
    options: {
      method: 'put'
    }
  },
  sessions: {
    url: `/sessions`,
    transformer(data, prevData = {
      entries: [],
      totalEntries: 0,
      name: 'Feedback'
    }, action) {
      if (data) {
        return {
          ...prevData,
          ...data,
          entries: data.sessions || [],
          totalEntries: data.count || 0
        };
      } else {
        return {
          ...prevData
        };
      }
    }
  },
  sessionsExtra: {
    url: `/sessions`,
    transformer(data, prevData = {
      entries: [],
      totalEntries: 0,
      name: 'Feedback'
    }, action) {
      if (data) {
        return {
          ...prevData,
          ...data,
          entries: data.sessions || [],
          totalEntries: data.count || 0
        };
      } else {
        return {
          ...prevData
        };
      }
    }
  },
  sessionDetail: {
    url: `/sessions/:id`,
    transformer(data, prevData) {
      if (data) {
        return {...prevData, ...data};
      } else {
        return {...prevData};
      }
    },
    crud: true
  }
})
.use('options', (url, params, getState) => {
  let token = null;

  const authState = getState().auth;
  if (authState.data) {
    token = authState.data.token;
  }

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
