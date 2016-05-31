'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthService = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _dec, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaFetchClient = require('aurelia-fetch-client');

var _aureliaEventAggregator = require('aurelia-event-aggregator');

var _authentication = require('./authentication');

var _baseConfig = require('./base-config');

var _oAuth = require('./oAuth1');

var _oAuth2 = require('./oAuth2');

var _authUtilities = require('./auth-utilities');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthService = exports.AuthService = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication, _oAuth.OAuth1, _oAuth2.OAuth2, _baseConfig.BaseConfig, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
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
    return this.http.fetch(profileUrl).then(_authUtilities.status);
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
      body: (0, _aureliaFetchClient.json)(content)
    }).then(_authUtilities.status).then(function (response) {
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
      body: typeof content === 'string' ? content : (0, _aureliaFetchClient.json)(content)
    }).then(_authUtilities.status).then(function (response) {
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

    var unlinkUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

    if (this.config.unlinkMethod === 'get') {
      return this.http.fetch(unlinkUrl + provider).then(_authUtilities.status).then(function (response) {
        _this4.eventAggregator.publish('auth:unlink', response);
        return response;
      });
    } else if (this.config.unlinkMethod === 'post') {
      return this.http.fetch(unlinkUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(provider)
      }).then(_authUtilities.status).then(function (response) {
        _this4.eventAggregator.publish('auth:unlink', response);
        return response;
      });
    }
  };

  return AuthService;
}()) || _class);