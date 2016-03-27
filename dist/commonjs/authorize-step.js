'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthorizeStep = undefined;

var _dec, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaRouter = require('aurelia-router');

var _authentication = require('./authentication');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthorizeStep = exports.AuthorizeStep = (_dec = (0, _aureliaDependencyInjection.inject)(_authentication.Authentication), _dec(_class = function () {
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
        return next.cancel(new _aureliaRouter.Redirect(loginRoute));
      }
    } else if (isLoggedIn && routingContext.getAllInstructions().some(function (i) {
      return i.fragment === loginRoute;
    })) {
      var loginRedirect = this.auth.getLoginRedirect();
      return next.cancel(new _aureliaRouter.Redirect(loginRedirect));
    }

    return next();
  };

  return AuthorizeStep;
}()) || _class);