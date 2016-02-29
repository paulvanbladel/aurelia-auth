'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaRouter = require('aurelia-router');

var _authentication = require('./authentication');

var _authUtils = require('./authUtils');

var _authUtils2 = _interopRequireDefault(_authUtils);

var AuthorizeStep = (function () {
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
        var _auth;

        var auth = new Set();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = routingContext.getAllInstructions()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            if (_authUtils2['default'].isArray(i.config.auth)) {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = i.config.auth[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var a = _step2.value;

                  auth.add(a);
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

        (_auth = this.auth).setInitialUrl.apply(_auth, [window.location.href].concat(_toConsumableArray(auth)));
        return next.cancel(new _aureliaRouter.Redirect(loginRoute));
      } else if (this.auth.isAuthenticated() && this.auth.isAuthorised(this.auth.getRequiredRoles()) && routingContext.getAllInstructions().some(function (i) {
        return i.fragment;
      }) == loginRoute) {
        var loginRedirect = this.auth.getLoginRedirect();
        return next.cancel(new _aureliaRouter.Redirect(loginRedirect));
      }

      return next();
    }
  }]);

  var _AuthorizeStep = AuthorizeStep;
  AuthorizeStep = (0, _aureliaDependencyInjection.inject)(_authentication.Authentication)(AuthorizeStep) || AuthorizeStep;
  return AuthorizeStep;
})();

exports.AuthorizeStep = AuthorizeStep;