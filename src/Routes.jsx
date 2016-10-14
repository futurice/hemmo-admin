let MenuRoutes = {
  '/': 'routeHome',
  '/sessions': 'routeFeedback',
  '/users': 'routeChildren'
};

let MiscRoutes = {
  '/login': 'routeLogin',
  '/sessions/:id': 'routeFeedbackDetails',
  '/users/:id': 'routeChildDetails',
  '/preferences': 'routePreferences',
  '/logout': 'routeLogout'
};

export { MenuRoutes, MiscRoutes };
