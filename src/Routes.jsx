let MenuRoutes = {
  '/': 'Home',
  '/sessions': 'Feedback',
  '/users': 'Children'
};

let MiscRoutes = {
  '/login': 'Login',
  '/sessions/:id': 'Feedback details',
  '/users/:id': 'Child details',
  '/preferences': 'Preferences',
  '/logout': 'Logout'
};

export { MenuRoutes, MiscRoutes };
