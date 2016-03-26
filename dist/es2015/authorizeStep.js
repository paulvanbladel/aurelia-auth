var _dec, _class;

import { inject } from 'aurelia-dependency-injection';
import { Authentication } from './authentication';
import { Router, Redirect } from 'aurelia-router';

export let AuthorizeStep = (_dec = inject(Authentication), _dec(_class = class AuthorizeStep {
  constructor(auth) {
    this.auth = auth;
  }
  run(routingContext, next) {
    var isLoggedIn = this.auth.isAuthenticated();
    var loginRoute = this.auth.getLoginRoute();

    if (routingContext.getAllInstructions().some(i => i.config.auth)) {
      if (!isLoggedIn) {
        this.auth.setInitialUrl(window.location.href);
        return next.cancel(new Redirect(loginRoute));
      }
    } else if (isLoggedIn && routingContext.getAllInstructions().some(i => i.fragment == loginRoute)) {
      var loginRedirect = this.auth.getLoginRedirect();
      return next.cancel(new Redirect(loginRedirect));
    }

    return next();
  }
}) || _class);