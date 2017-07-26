import reduxApi from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import { push } from 'react-router-redux';
import jwtDecode from 'jwt-decode';

import { showError } from '../modules/ErrorSnackbar';
import { reset } from '../modules/Logout';

let store;

export const injectStore = _store => {
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
  apiRoot = 'http://localhost:3001/admin';
} else {
  apiRoot = 'https://hemmo-backend.herokuapp.com/admin';
}

const emptyMeta = {
  count: 0,
  limit: 30,
  offset: 0,
};

const rest = reduxApi({
  children: {
    url: `${apiRoot}/children`,
    transformer(
      data,
      prevData = {
        entries: [],
        meta: emptyMeta,
        name: 'Children',
      },
      action,
    ) {
      if (data) {
        return {
          ...prevData,
          entries: data.data,
          meta: data.meta,
        };
      } else {
        return {
          ...prevData,
        };
      }
    },
    crud: true,
  },
  child: {
    url: `${apiRoot}/children/:childId`,
    crud: true,
  },
  userDetails: {
    url: `${apiRoot}/employee/:userId`,
    crud: true,
  },
  employees: {
    url: `${apiRoot}/employees`,
    transformer(
      data,
      prevData = {
        entries: [],
        meta: emptyMeta,
        name: 'Employees',
      },
    ) {
      if (data) {
        return {
          ...prevData,
          entries: data.data,
          meta: data.meta,
        };
      } else {
        return {
          ...prevData,
        };
      }
    },
  },
  employee: {
    url: `${apiRoot}/employees/:id`,
    transformer(data, prevData) {
      if (data) {
        return { ...prevData, ...data };
      } else {
        return { ...prevData };
      }
    },
    crud: true,
  },
  employeeCreate: {
    url: `${apiRoot}/employees`,
    options: {
      method: 'post',
    },
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
      method: 'put',
    },
  },
  feedback: {
    url: `${apiRoot}/feedback`,
    transformer(
      data,
      prevData = {
        entries: [],
        meta: emptyMeta,
        name: 'Feedback',
      },
      action,
    ) {
      if (data) {
        return {
          ...prevData,
          entries: data.data,
          meta: data.meta,
        };
      } else {
        return {
          ...prevData,
        };
      }
    },
  },
  feedbackMoods: {
    url: `${apiRoot}/feedback/moods`,
    transformer(
      data,
      prevData = {
        entries: [],
        meta: emptyMeta,
        name: 'FeedbackMoods',
      },
      action,
    ) {
      if (data) {
        return {
          ...prevData,
          entries: data.data,
          meta: data.meta,
        };
      } else {
        return {
          ...prevData,
        };
      }
    },
  },
  feedbackDetail: {
    url: `${apiRoot}/feedback/:feedbackId`,
    transformer(data, prevData) {
      if (data) {
        return { ...data };
      } else {
        return { ...prevData };
      }
    },
    crud: true,
  },
  locale: {
    url: `${apiRoot}/locale`,
    crud: true,
  },
  auth: {
    url: `${apiRoot}/employees/authenticate`,
    reducerName: 'auth',
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
  renewAuth: {
    url: `${apiRoot}/employees/authenticate/renew`,
    reducerName: 'auth',
    transformer: (data = {}) => {
      if (data.token) {
        return {
          ...data,
          decoded: jwtDecode(data.token),
        };
      }
      return data;
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
  .use('responseHandler', err => {
    if (err) {
      let msg = 'Error';

      // Redirect to login if session has expired
      if (err.statusCode === 401 && err.message === 'Invalid token') {
        store.dispatch(reset());
        store.dispatch(push('/login'));
      }

      // error code
      msg += err.statusCode ? ` ${err.statusCode}` : '';

      // error reason
      msg += err.error ? ` ${err.error}` : '';

      // error description
      msg += err.message ? `: ${err.message}` : '';
      store.dispatch(
        showError({
          msg,
          details: JSON.stringify(err, Object.getOwnPropertyNames(err), 4),
        }),
      );

      throw err;
    }
  });

export default rest;
export const root = apiRoot;
export const reducers = rest.reducers;
