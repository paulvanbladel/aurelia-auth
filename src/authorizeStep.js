import {inject} from 'aurelia-dependency-injection';
import {Authentication} from './authentication';
import {Router, Redirect} from 'aurelia-router';
import authUtils from './authUtils';

@inject(Authentication)
export class AuthorizeStep {
  constructor(auth) {
    this.auth = auth;
  }

  run(routingContext, next) {
    let loginRoute = this.auth.getLoginRoute();

    if (routingContext.getAllInstructions().some(i => !this.auth.isAuthorised(i.config.auth))) {
      let auth = [];
      for (let i of routingContext.getAllInstructions()) {
        if (authUtils.isArray(i.config.auth)) {
          for (let a of i.config.auth) {
            auth.push(a);
          }
        }
      }
      this.auth.setInitialUrl(window.location.href, auth);
      return next.cancel(new Redirect(loginRoute));
    } else if (
      this.auth.isAuthenticated() && //is logged in?
      this.auth.isAuthorised(this.auth.getRequiredRoles()) && //have authorization to access initial route?
      routingContext.getAllInstructions().some(i => i.fragment === loginRoute)
    ) {
      let loginRedirect = this.auth.getLoginRedirect();
      return next.cancel(new Redirect(loginRedirect));
    }

    return next();
  }
}
