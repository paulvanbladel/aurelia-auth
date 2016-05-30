'use strict';

System.register(['aurelia-dependency-injection', './base-config', './storage', './auth-utilities'], function (_export, _context) {
  "use strict";

  var inject, BaseConfig, Storage, joinUrl, isObject, isString, _createClass, _dec, _class, Authentication;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }, function (_storage) {
      Storage = _storage.Storage;
    }, function (_authUtilities) {
      joinUrl = _authUtilities.joinUrl;
      isObject = _authUtilities.isObject;
      isString = _authUtilities.isString;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('Authentication', Authentication = (_dec = inject(Storage, BaseConfig), _dec(_class = function () {
        function Authentication(storage, config) {
          _classCallCheck(this, Authentication);

          this.storage = storage;
          this.config = config.current;
          this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
          this.idTokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
        }

        Authentication.prototype.getLoginRoute = function getLoginRoute() {
          return this.config.loginRoute;
        };

        Authentication.prototype.getLoginRedirect = function getLoginRedirect() {
          return this.initialUrl || this.config.loginRedirect;
        };

        Authentication.prototype.getLoginUrl = function getLoginUrl() {
          return this.config.baseUrl ? joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
        };

        Authentication.prototype.getSignupUrl = function getSignupUrl() {
          return this.config.baseUrl ? joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
        };

        Authentication.prototype.getProfileUrl = function getProfileUrl() {
          return this.config.baseUrl ? joinUrl(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
        };

        Authentication.prototype.getToken = function getToken() {
          return this.storage.get(this.tokenName);
        };

        Authentication.prototype.getPayload = function getPayload() {
          var token = this.storage.get(this.tokenName);
          return this.decomposeToken(token);
        };

        Authentication.prototype.decomposeToken = function decomposeToken(token) {
          if (token && token.split('.').length === 3) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            try {
              return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
            } catch (error) {
              return null;
            }
          }
        };

        Authentication.prototype.setInitialUrl = function setInitialUrl(url) {
          this.initialUrl = url;
        };

        Authentication.prototype.setToken = function setToken(response, redirect) {
          var accessToken = response && response[this.config.responseTokenProp];
          var tokenToStore = void 0;

          if (accessToken) {
            if (isObject(accessToken) && isObject(accessToken.data)) {
              response = accessToken;
            } else if (isString(accessToken)) {
              tokenToStore = accessToken;
            }
          }

          if (!tokenToStore && response) {
            tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
          }

          if (tokenToStore) {
            this.storage.set(this.tokenName, tokenToStore);
          }

          var idToken = response && response[this.config.responseIdTokenProp];

          if (idToken) {
            this.storage.set(this.idTokenName, idToken);
          }

          if (this.config.loginRedirect && !redirect) {
            window.location.href = this.getLoginRedirect();
          } else if (redirect && isString(redirect)) {
            window.location.href = window.encodeURI(redirect);
          }
        };

        Authentication.prototype.removeToken = function removeToken() {
          this.storage.remove(this.tokenName);
        };

        Authentication.prototype.isAuthenticated = function isAuthenticated() {
          var token = this.storage.get(this.tokenName);

          if (!token) {
            return false;
          }

          if (token.split('.').length !== 3) {
            return true;
          }

          var exp = void 0;
          try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            exp = JSON.parse(window.atob(base64)).exp;
          } catch (error) {
            return false;
          }

          if (exp) {
            return Math.round(new Date().getTime() / 1000) <= exp;
          }

          return true;
        };

        Authentication.prototype.logout = function logout(redirect) {
          var _this = this;

          return new Promise(function (resolve) {
            _this.storage.remove(_this.tokenName);

            if (_this.config.logoutRedirect && !redirect) {
              window.location.href = _this.config.logoutRedirect;
            } else if (isString(redirect)) {
              window.location.href = redirect;
            }

            resolve();
          });
        };

        _createClass(Authentication, [{
          key: 'tokenInterceptor',
          get: function get() {
            var config = this.config;
            var storage = this.storage;
            var auth = this;
            return {
              request: function request(_request) {
                if (auth.isAuthenticated() && config.httpInterceptor) {
                  var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
                  var token = storage.get(tokenName);

                  if (config.authHeader && config.authToken) {
                    token = config.authToken + ' ' + token;
                  }

                  _request.headers.set(config.authHeader, token);
                }
                return _request;
              }
            };
          }
        }]);

        return Authentication;
      }()) || _class));

      _export('Authentication', Authentication);
    }
  };
});