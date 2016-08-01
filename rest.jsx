import 'isomorphic-fetch';
import reduxApi, { transformers } from 'redux-api';
import { normalize, Schema, arrayOf } from 'normalizr';

import adapterFetch from 'redux-api/lib/adapters/fetch';
const API_ROOT = 'http://localhost:3001';
const API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6WzFdLCJuYW1lIjoiZm9vIiwic2NvcGUiOiJlbXBsb3llZSIsImlhdCI6MTQ3MDAzMzc0MiwiZXhwIjoxNDcwMDUxNzQyfQ.8nUQZl5Y9mBvxoH3VjzJs-tCufMaoI5JV6yrU82fmcQ';

export default reduxApi({
  users: {
    url: `${API_ROOT}/users`,
    transformer: (data = {users: []}, prevData, action) => {
      return data.users;
    },
    options: {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    }
  }
}).use('fetch', adapterFetch(fetch));
