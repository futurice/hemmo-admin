import * as types from '../constants/ActionTypes';

export function changeView(view) {
  return { type: types.CHANGE_VIEW, view };
}

export function closeDrawer() {
  return { type: types.CLOSE_DRAWER };
}

export function toggleDrawer() {
  return { type: types.TOGGLE_DRAWER };
}
