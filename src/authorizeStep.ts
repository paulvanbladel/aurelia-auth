import {inject} from 'aurelia-framework';
import {Authentication} from './authentication';
import {Redirect} from 'aurelia-router';
import {Router} from 'aurelia-router';

@inject(Authentication)
export class AuthorizeStep {
  constructor(private auth: Authentication) {
  }
  run(routingContext, next) {
    var isLoggedIn = this.auth.isAuthenticated();
    var loginRoute = this.auth.getLoginRoute();

    if (routingContext.getAllInstructions().some(i => i.config.auth)) {
      if (!isLoggedIn) {
        console.log("login route : " + loginRoute);
        return next.cancel(new Redirect(loginRoute));
      }
    }
    else if (isLoggedIn && routingContext.getAllInstructions().some(i => i.fragment) == loginRoute) {
      var loginRedirect = this.auth.getLoginRedirect();
      return next.cancel(new Redirect(loginRedirect));
    }

    return next();
  }
}
