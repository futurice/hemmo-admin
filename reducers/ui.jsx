import { CHANGE_VIEW, TOGGLE_DRAWER, CLOSE_DRAWER } from '../constants/ActionTypes';
import { PREFERENCES, USERS, SESSIONS } from '../constants/Views';

const initialState = {
  view: SESSIONS,
  drawerOpened: false
};

export default function ui(state = initialState, action) {
  switch (action.type) {
    case CHANGE_VIEW:
      return Object.assign({}, state, {
        view: action.view
      });

    case TOGGLE_DRAWER:
      return Object.assign({}, state, {
        drawerOpened: !state.drawerOpened
      });

    case CLOSE_DRAWER:
      return Object.assign({}, state, {
        drawerOpened: false
      });

    default:
      return state;
  }
}
