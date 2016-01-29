import {inject} from 'aurelia-framework';
import {Authentication} from './authentication';
import {Router, Redirect} from 'aurelia-router';

@inject(Authentication)
export class AuthorizeStep {
  constructor(auth) {
    this.auth = auth;
  }
  run(routingContext, next) {
    var isLoggedIn = this.auth.isAuthenticated();
    var loginRoute = this.auth.getLoginRoute();

    if (routingContext.getAllInstructions().some(i => i.config.auth)) {
      if (!isLoggedIn) {
        console.log("login route : " + loginRoute);
        this.auth.setInitialUrl(window.location.href);
        return next.cancel(new Redirect(loginRoute));
      }
    } else if (isLoggedIn && routingContext.getAllInstructions().some(i => i.fragment) == loginRoute) {
      var loginRedirect = this.auth.getLoginRedirect();
      return next.cancel(new Redirect(loginRedirect));
    }

    return next();
  }
}
