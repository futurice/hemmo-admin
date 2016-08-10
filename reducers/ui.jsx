import { createReducer } from 'redux-act';
import * as Actions from '../actions/ui';
import { Map } from 'immutable';

// TODO: DEFAULT_VIEW might not be correct here if going straight to view url
const initialState = Map({
  drawerOpened: false
});

export default createReducer({
  [Actions.toggleDrawer]: (state) => state.set('drawerOpened', !state.get('drawerOpened')),
  [Actions.closeDrawer]: (state) => state.set('drawerOpened', false),
  [Actions.openDrawer]: (state) => state.set('drawerOpened', true)
}, initialState);
