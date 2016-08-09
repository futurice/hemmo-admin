import { createAction } from 'redux-act';

export const closeDrawer = createAction('Close menu drawer');
export const openDrawer = createAction('Open menu drawer');
export const toggleDrawer = createAction('Toggle menu drawer');
export const logOut = createAction('Log out of the application');
