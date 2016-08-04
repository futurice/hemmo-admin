import { createAction } from 'redux-act';

export const changeView = createAction('Change current view');
export const closeDrawer = createAction('Close menu drawer');
export const toggleDrawer = createAction('Toggle menu drawer');
export const logOut = createAction('Log out of the application');
