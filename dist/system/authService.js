System.register(['aurelia-framework', 'aurelia-fetch-client', './authentication', './baseConfig', './oAuth1', './oAuth2', './authUtils'], function (_export) {
  'use strict';

  var inject, computedFrom, ObserverLocator, HttpClient, json, Authentication, BaseConfig, OAuth1, OAuth2, authUtils, AuthService;

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _createDecoratedObject(descriptors) { var target = {}; for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = true; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } } if (descriptor.initializer) { descriptor.value = descriptor.initializer.call(target); } Object.defineProperty(target, key, descriptor); } return target; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function toJson(response) {
    return response.json();
  }
  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
      computedFrom = _aureliaFramework.computedFrom;
      ObserverLocator = _aureliaFramework.ObserverLocator;
    }, function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
      json = _aureliaFetchClient.json;
    }, function (_authentication) {
      Authentication = _authentication.Authentication;
    }, function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }, function (_oAuth1) {
      OAuth1 = _oAuth1.OAuth1;
    }, function (_oAuth2) {
      OAuth2 = _oAuth2.OAuth2;
    }, function (_authUtils) {
      authUtils = _authUtils['default'];
    }],
    execute: function () {
      AuthService = (function () {
        function AuthService(observerLocator, http, auth, oAuth1, oAuth2, config) {
          var _this = this;

          _classCallCheck(this, _AuthService);

          this.http = http;
          this.auth = auth;
          this.oAuth1 = oAuth1;
          this.oAuth2 = oAuth2;
          this.config = config.current;
          this.roleAuthenticator = {};
          this.token = this.auth.token;
          observerLocator.getObserver(this.auth, 'token').subscribe(function (newToken) {
            _this.token = newToken;
            Object.keys(_this.roleAuthenticator).forEach(function (kra) {
              _this.roleAuthenticator[kra].token = newToken;
            });
          });
        }

        _createDecoratedClass(AuthService, [{
          key: 'getMe',
          value: function getMe() {
            var profileUrl = this.auth.getProfileUrl();
            return this.http.fetch(profileUrl).then(status).then(toJson).then(function (response) {
              return response;
            });
          }
        }, {
          key: 'withRoles',
          value: function withRoles() {
            var _this2 = this;

            var roles = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

            var key = JSON.stringify(authUtils.isArray(roles) ? roles.sort() : roles);
            if (!this.roleAuthenticator[key]) {
              (function () {
                var self = _this2;
                _this2.roleAuthenticator[key] = _createDecoratedObject([{
                  key: 'token',
                  initializer: function initializer() {
                    return self.auth.token;
                  }
                }, {
                  key: 'isAuthenticated',
                  decorators: [computedFrom('token')],
                  get: function get() {
                    return self.auth.isAuthenticated(roles);
                  }
                }, {
                  key: 'isAuthorised',
                  decorators: [computedFrom('token')],
                  get: function get() {
                    return self.auth.isAuthorised(roles);
                  }
                }]);
              })();
            }
            return this.roleAuthenticator[key];
          }
        }, {
          key: 'signup',
          value: function signup(displayName, email, password) {
            var _this3 = this;

            var signupUrl = this.auth.getSignupUrl();
            var content;
            if (typeof arguments[0] === 'object') {
              content = arguments[0];
            } else {
              content = {
                'displayName': displayName,
                'email': email,
                'password': password
              };
            }

            return this.http.fetch(signupUrl, { method: 'post', body: json(content) }).then(status).then(toJson).then(function (response) {
              if (_this3.config.loginOnSignup) {
                _this3.auth.setToken(response);
              } else if (_this3.config.signupRedirect) {
                window.location.href = _this3.config.signupRedirect;
              }
              return response;
            });
          }
        }, {
          key: 'login',
          value: function login(email, password) {
            var _this4 = this;

            var loginUrl = this.auth.getLoginUrl();
            var content;
            if (typeof arguments[1] !== 'string') {
              content = arguments[0];
            } else {
              content = {
                'email': email,
                'password': password
              };
            }

            return this.http.fetch(loginUrl, {
              method: 'post',
              headers: typeof content === 'string' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {},
              body: typeof content === 'string' ? content : json(content)
            }).then(status).then(toJson).then(function (response) {
              _this4.auth.setToken(response);
              return response;
            });
          }
        }, {
          key: 'logout',
          value: function logout(redirectUri) {
            return this.auth.logout(redirectUri);
          }
        }, {
          key: 'authenticate',
          value: function authenticate(name, redirect, userData) {
            var _this5 = this;

            var provider = this.oAuth2;
            if (this.config.providers[name].type === '1.0') {
              provider = this.oAuth1;
            }
            ;

            return provider.open(this.config.providers[name], userData || {}).then(function (response) {
              _this5.auth.setToken(response, redirect);
              return response;
            });
          }
        }, {
          key: 'unlink',
          value: function unlink(provider) {
            var unlinkUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

            if (this.config.unlinkMethod === 'get') {
              return this.http.fetch(unlinkUrl + provider).then(function (response) {
                return response;
              });
            } else if (this.config.unlinkMethod === 'post') {
              return this.http.fetch(unlinkUrl, {
                method: 'post',
                body: json(provider)
              }).then(function (response) {
                return response;
              });
            }
          }
        }, {
          key: 'tokenPayload',
          decorators: [computedFrom('token')],
          get: function get() {
            return this.auth.getPayload();
          }
        }]);

        var _AuthService = AuthService;
        AuthService = inject(ObserverLocator, HttpClient, Authentication, OAuth1, OAuth2, BaseConfig)(AuthService) || AuthService;
        return AuthService;
      })();

      _export('AuthService', AuthService);
    }
  };
});