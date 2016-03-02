System.register(['aurelia-dependency-injection', './authentication', 'aurelia-router', './authUtils'], function (_export) {
  'use strict';

  var inject, Authentication, Redirect, authUtils, AuthorizeStep;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_authentication) {
      Authentication = _authentication.Authentication;
    }, function (_aureliaRouter) {
      Redirect = _aureliaRouter.Redirect;
    }, function (_authUtils) {
      authUtils = _authUtils['default'];
    }],
    execute: function () {
      AuthorizeStep = (function () {
        function AuthorizeStep(auth) {
          _classCallCheck(this, _AuthorizeStep);

          this.auth = auth;
        }

        _createClass(AuthorizeStep, [{
          key: 'run',
          value: function run(routingContext, next) {
            var _this = this;

            var loginRoute = this.auth.getLoginRoute();

            if (routingContext.getAllInstructions().some(function (i) {
              return !_this.auth.isAuthorised(i.config.auth);
            })) {
              var auth = [];
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = routingContext.getAllInstructions()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var i = _step.value;

                  if (authUtils.isArray(i.config.auth)) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                      for (var _iterator2 = i.config.auth[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var a = _step2.value;

                        auth.push(a);
                      }
                    } catch (err) {
                      _didIteratorError2 = true;
                      _iteratorError2 = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                          _iterator2['return']();
                        }
                      } finally {
                        if (_didIteratorError2) {
                          throw _iteratorError2;
                        }
                      }
                    }
                  }
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              this.auth.setInitialUrl(window.location.href, auth);
              return next.cancel(new Redirect(loginRoute));
            } else if (this.auth.isAuthenticated() && this.auth.isAuthorised(this.auth.getRequiredRoles()) && routingContext.getAllInstructions().some(function (i) {
              return i.fragment === loginRoute;
            })) {
              var loginRedirect = this.auth.getLoginRedirect();
              return next.cancel(new Redirect(loginRedirect));
            }

            return next();
          }
        }]);

        var _AuthorizeStep = AuthorizeStep;
        AuthorizeStep = inject(Authentication)(AuthorizeStep) || AuthorizeStep;
        return AuthorizeStep;
      })();

      _export('AuthorizeStep', AuthorizeStep);
    }
  };
});