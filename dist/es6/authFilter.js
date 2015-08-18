export class AuthFilterValueConverter {
  toView(routes, isAuthenticated) {
    console.log(isAuthenticated);
    if (isAuthenticated)
      return routes;

    return routes.filter(r => !r.config.auth);
  }
}
