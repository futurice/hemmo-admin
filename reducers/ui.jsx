import { createReducer } from 'redux-act';
import * as Actions from '../actions/ui';
import { Map } from 'immutable';
import { DEFAULT_VIEW } from '../constants/Views';

// TODO: DEFAULT_VIEW might not be correct here if going straight to view url
const initialState = Map({
  view: DEFAULT_VIEW,
  drawerOpened: false
});

export default createReducer({
  [Actions.changeView]: (state, payload) => state.set('view', payload),
  [Actions.toggleDrawer]: (state) => state.set('drawerOpened', !state.get('drawerOpened')),
  [Actions.closeDrawer]: (state) => state.set('drawerOpened', false)
}, initialState);
