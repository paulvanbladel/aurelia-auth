'use strict';

System.register(['aurelia-dependency-injection', './authentication', 'aurelia-router'], function (_export, _context) {
  var inject, Authentication, Router, Redirect, _dec, _class, AuthorizeStep;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_authentication) {
      Authentication = _authentication.Authentication;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
      Redirect = _aureliaRouter.Redirect;
    }],
    execute: function () {
      _export('AuthorizeStep', AuthorizeStep = (_dec = inject(Authentication), _dec(_class = function () {
        function AuthorizeStep(auth) {
          _classCallCheck(this, AuthorizeStep);

          this.auth = auth;
        }

        AuthorizeStep.prototype.run = function run(routingContext, next) {
          var isLoggedIn = this.auth.isAuthenticated();
          var loginRoute = this.auth.getLoginRoute();

          if (routingContext.getAllInstructions().some(function (i) {
            return i.config.auth;
          })) {
            if (!isLoggedIn) {
              this.auth.setInitialUrl(window.location.href);
              return next.cancel(new Redirect(loginRoute));
            }
          } else if (isLoggedIn && routingContext.getAllInstructions().some(function (i) {
            return i.fragment == loginRoute;
          })) {
            var loginRedirect = this.auth.getLoginRedirect();
            return next.cancel(new Redirect(loginRedirect));
          }

          return next();
        };

        return AuthorizeStep;
      }()) || _class));

      _export('AuthorizeStep', AuthorizeStep);
    }
  };
});