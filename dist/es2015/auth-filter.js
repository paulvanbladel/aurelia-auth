export let AuthFilterValueConverter = class AuthFilterValueConverter {
  toView(routes, isAuthenticated) {
    return routes.filter(r => r.config.auth === undefined || r.config.auth === isAuthenticated);
  }
};