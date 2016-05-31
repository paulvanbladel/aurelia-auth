'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-fetch-client', 'aurelia-event-aggregator', './authentication', './base-config', './oAuth1', './oAuth2', './auth-utilities'], function (_export, _context) {
  "use strict";

  var inject, HttpClient, json, EventAggregator, Authentication, BaseConfig, OAuth1, OAuth2, status, joinUrl, _typeof, _dec, _class, AuthService;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
      json = _aureliaFetchClient.json;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_authentication) {
      Authentication = _authentication.Authentication;
    }, function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }, function (_oAuth) {
      OAuth1 = _oAuth.OAuth1;
    }, function (_oAuth2) {
      OAuth2 = _oAuth2.OAuth2;
    }, function (_authUtilities) {
      status = _authUtilities.status;
      joinUrl = _authUtilities.joinUrl;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

      _export('AuthService', AuthService = (_dec = inject(HttpClient, Authentication, OAuth1, OAuth2, BaseConfig, EventAggregator), _dec(_class = function () {
        function AuthService(http, auth, oAuth1, oAuth2, config, eventAggregator) {
          _classCallCheck(this, AuthService);

          this.http = http;
          this.auth = auth;
          this.oAuth1 = oAuth1;
          this.oAuth2 = oAuth2;
          this.config = config.current;
          this.tokenInterceptor = auth.tokenInterceptor;
          this.eventAggregator = eventAggregator;
        }

        AuthService.prototype.getMe = function getMe() {
          var profileUrl = this.auth.getProfileUrl();
          return this.http.fetch(profileUrl).then(status);
        };

        AuthService.prototype.isAuthenticated = function isAuthenticated() {
          return this.auth.isAuthenticated();
        };

        AuthService.prototype.getTokenPayload = function getTokenPayload() {
          return this.auth.getPayload();
        };

        AuthService.prototype.signup = function signup(displayName, email, password) {
          var _this = this;

          var signupUrl = this.auth.getSignupUrl();
          var content = void 0;
          if (_typeof(arguments[0]) === 'object') {
            content = arguments[0];
          } else {
            content = {
              'displayName': displayName,
              'email': email,
              'password': password
            };
          }

          return this.http.fetch(signupUrl, {
            method: 'post',
            body: json(content)
          }).then(status).then(function (response) {
            if (_this.config.loginOnSignup) {
              _this.auth.setToken(response);
            } else if (_this.config.signupRedirect) {
              window.location.href = _this.config.signupRedirect;
            }
            _this.eventAggregator.publish('auth:signup', response);
            return response;
          });
        };

        AuthService.prototype.login = function login(email, password) {
          var _this2 = this;

          var loginUrl = this.auth.getLoginUrl();
          var content = void 0;
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
          }).then(status).then(function (response) {
            _this2.auth.setToken(response);
            _this2.eventAggregator.publish('auth:login', response);
            return response;
          });
        };

        AuthService.prototype.logout = function logout(redirectUri) {
          this.eventAggregator.publish('auth:logout');
          return this.auth.logout(redirectUri);
        };

        AuthService.prototype.authenticate = function authenticate(name, redirect, userData) {
          var _this3 = this;

          var provider = this.oAuth2;
          if (this.config.providers[name].type === '1.0') {
            provider = this.oAuth1;
          }

          return provider.open(this.config.providers[name], userData || {}).then(function (response) {
            _this3.auth.setToken(response, redirect);
            _this3.eventAggregator.publish('auth:authenticate', response);
            return response;
          });
        };

        AuthService.prototype.unlink = function unlink(provider) {
          var _this4 = this;

          var unlinkUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

          if (this.config.unlinkMethod === 'get') {
            return this.http.fetch(unlinkUrl + provider).then(status).then(function (response) {
              _this4.eventAggregator.publish('auth:unlink', response);
              return response;
            });
          } else if (this.config.unlinkMethod === 'post') {
            return this.http.fetch(unlinkUrl, {
              method: 'post',
              body: json(provider)
            }).then(status).then(function (response) {
              _this4.eventAggregator.publish('auth:unlink', response);
              return response;
            });
          }
        };

        return AuthService;
      }()) || _class));

      _export('AuthService', AuthService);
    }
  };
});