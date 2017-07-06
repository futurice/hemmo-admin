import reduxApi, { transformers } from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import jwtDecode from 'jwt-decode';

import { showError } from '../modules/ErrorSnackbar';

let store;

export const injectStore = (_store) => {
  store = _store;
};

/*
// Endpoint configurations
These example endpoints can be called by dispatching the respective actions, e.g:

dispatch(rest.actions.teams.post({teamId: 42}, { body: JSON.stringify(exampleData) }));
Results in: POST /teams?teamId=42 with POST data from 'exampleData'

Result of request can be found in: `state.teams.data`
Information about request: `state.teams.error`, `state.teams.sync`, `state.teams.error`...
*/

let apiRoot;

if (process.env.NODE_ENV === 'development') {
  apiRoot = 'http://localhost:3001';
} else {
  apiRoot = 'https://hemmo-backend.herokuapp.com';
}

const rest = reduxApi({
  users: {
    url: `${apiRoot}/users`,
    transformer(data, prevData = {
      entries: [],
      totalEntries: 0,
      name: 'Users'
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
    },
    crud: true,
  },
  userDetails: {
    url: `${apiRoot}/users/:userId`,
    crud: true,
  },

  employees: {
    url: `${apiRoot}/employees`,
    transformer(data) {
      if (data) {
        return data.employees;
      } else {
        return [];
      }
    }
  },
  employeePassword: {
    url: `${apiRoot}/employees/password`,
    options: {
      method: 'post'
    }
  },
  employeeVerify: {
    url: `${apiRoot}/employees/verify/:employeeId`,
    options: {
      method: 'post'
    }
  },
  employeeDetail: {
    url: `${apiRoot}/employees/:id`,
    transformer(data, prevData) {
      if (data) {
        return {...prevData, ...data};
      } else {
        return {...prevData};
      }
    },
    crud: true
  },
  userDetail: {
    url: `${apiRoot}/users/:id`,
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
    url: `${apiRoot}/users/:userId`,
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
    url: `${apiRoot}/sessions`,
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
  /*sessionsExtra: {
    url: `${apiRoot}/sessions`,
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
  },*/
  sessionDetail: {
    url: `${apiRoot}/sessions/:id`,
    transformer(data, prevData) {
      if (data) {
        return {...prevData, ...data};
      } else {
        return {...prevData};
      }
    },
    crud: true
  },
  locale: {
    url: `${apiRoot}/locale`,
    crud: true
  },
  auth: {
    url: `${apiRoot}/employees/authenticate`,
    transformer: (data = {}) => {
      if (data.token) {
        return {
          ...data,
          decoded: jwtDecode(data.token),
        };
      }
      return data;
    },

    options: {
      method: 'POST',
    },
  },
})
.use('options', (url, params, getState) => {
  const { auth: { data: { token } } } = getState();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  // Add token to request headers
  if (token) {
    return { headers: { ...headers, Authorization: `Bearer ${token}` } };
  }

  return { headers };
})
.use('fetch', adapterFetch(fetch))
.use('responseHandler', (err) => {
  if (err) {
    let msg = 'Error';

    // error code
    msg += err.statusCode ? ` ${err.statusCode}` : '';

    // error reason
    msg += err.error ? ` ${err.error}` : '';

    // error description
    msg += err.message ? `: ${err.message}` : '';
    store.dispatch(showError({
      msg,
      details: JSON.stringify(err, Object.getOwnPropertyNames(err), 4),
    }));

    throw err;
  }
});

export default rest;
export const reducers = rest.reducers;
