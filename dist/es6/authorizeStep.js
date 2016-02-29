import {inject} from 'aurelia-framework';
import {Router, Redirect} from 'aurelia-router';
import {Authentication} from './authentication';
import authUtils from './authUtils';

@inject(Authentication)
export class AuthorizeStep {
  constructor(auth) {
    this.auth = auth;
  }

  run(routingContext, next) {
    var loginRoute = this.auth.getLoginRoute();

    //TODO what if user is authenticated but has no valid role?
    if (routingContext.getAllInstructions().some(i => !this.auth.isAuthorised(i.config.auth))) {
      let auth = new Set();
      for(let i of routingContext.getAllInstructions()) {
        if(authUtils.isArray(i.config.auth)) {
          for(let a of i.config.auth) {
            auth.add(a);
          }
        }
      }
      this.auth.setInitialUrl(window.location.href, ...auth);
      return next.cancel(new Redirect(loginRoute));
    } else if (
        this.auth.isAuthenticated() && //is logged in?
        this.auth.isAuthorised(this.auth.getRequiredRoles()) && //have authorization to access initial route?
        routingContext.getAllInstructions().some(i => i.fragment) == loginRoute
      ) {
      var loginRedirect = this.auth.getLoginRedirect();
      return next.cancel(new Redirect(loginRedirect));
    }

    return next();
  }
}
