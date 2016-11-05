'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthService = exports.OAuth2 = exports.AuthorizeStep = exports.FetchConfig = exports.OAuth1 = exports.Authentication = exports.Storage = exports.Popup = exports.BaseConfig = exports.AuthFilterValueConverter = undefined;

var _dec, _class, _dec2, _class2, _dec3, _class3, _dec4, _class4, _dec5, _class5, _dec6, _class6, _dec7, _class7, _dec8, _class8;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.status = status;
exports.isDefined = isDefined;
exports.camelCase = camelCase;
exports.parseQueryString = parseQueryString;
exports.isString = isString;
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.joinUrl = joinUrl;
exports.isBlankObject = isBlankObject;
exports.isArrayLike = isArrayLike;
exports.isWindow = isWindow;
exports.extend = extend;
exports.merge = merge;
exports.forEach = forEach;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaFetchClient = require('aurelia-fetch-client');

var _aureliaRouter = require('aurelia-router');

var _aureliaEventAggregator = require('aurelia-event-aggregator');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var slice = [].slice;

function setHashKey(obj, h) {
  if (h) {
    obj.$$hashKey = h;
  } else {
    delete obj.$$hashKey;
  }
}

function baseExtend(dst, objs, deep) {
  var h = dst.$$hashKey;

  for (var i = 0, ii = objs.length; i < ii; ++i) {
    var obj = objs[i];
    if (!isObject(obj) && !isFunction(obj)) continue;
    var keys = Object.keys(obj);
    for (var j = 0, jj = keys.length; j < jj; j++) {
      var key = keys[j];
      var src = obj[key];

      if (deep && isObject(src)) {
        if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
        baseExtend(dst[key], [src], true);
      } else {
        dst[key] = src;
      }
    }
  }

  setHashKey(dst, h);
  return dst;
}

function status(response) {
  if (response.status >= 200 && response.status < 400) {
    return response.json().catch(function (error) {
      return null;
    });
  }

  throw response;
}

function isDefined(value) {
  return typeof value !== 'undefined';
}

function camelCase(name) {
  return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  });
}

function parseQueryString(keyValue) {
  var key = void 0;
  var value = void 0;
  var obj = {};

  forEach((keyValue || '').split('&'), function (kv) {
    if (kv) {
      value = kv.split('=');
      key = decodeURIComponent(value[0]);
      obj[key] = isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
    }
  });

  return obj;
}

function isString(value) {
  return typeof value === 'string';
}

function isObject(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

function isFunction(value) {
  return typeof value === 'function';
}

function joinUrl(baseUrl, url) {
  if (/^(?:[a-z]+:)?\/\//i.test(url)) {
    return url;
  }

  var joined = [baseUrl, url].join('/');
  var normalize = function normalize(str) {
    return str.replace(/[\/]+/g, '/').replace(/\/\?/g, '?').replace(/\/\#/g, '#').replace(/\:\//g, '://');
  };

  return normalize(joined);
}

function isBlankObject(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Object.getPrototypeOf(value);
}

function isArrayLike(obj) {
  if (obj === null || isWindow(obj)) {
    return false;
  }
}

function isWindow(obj) {
  return obj && obj.window === obj;
}

function extend(dst) {
  return baseExtend(dst, slice.call(arguments, 1), false);
}

function merge(dst) {
  return baseExtend(dst, slice.call(arguments, 1), true);
}

function forEach(obj, iterator, context) {
  var key = void 0;
  var length = void 0;
  if (obj) {
    if (isFunction(obj)) {
      for (key in obj) {
        if (key !== 'prototype' && key !== 'length' && key !== 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (Array.isArray(obj) || isArrayLike(obj)) {
      var isPrimitive = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object';
      for (key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
      obj.forEach(iterator, context, obj);
    } else if (isBlankObject(obj)) {
      for (key in obj) {
        iterator.call(context, obj[key], key, obj);
      }
    } else if (typeof obj.hasOwnProperty === 'function') {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else {
      for (key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    }
  }
  return obj;
}

var AuthFilterValueConverter = exports.AuthFilterValueConverter = function () {
  function AuthFilterValueConverter() {
    _classCallCheck(this, AuthFilterValueConverter);
  }

  AuthFilterValueConverter.prototype.toView = function toView(routes, isAuthenticated) {
    return routes.filter(function (r) {
      return r.config.auth === undefined || r.config.auth === isAuthenticated;
    });
  };

  return AuthFilterValueConverter;
}();

var BaseConfig = exports.BaseConfig = function () {
  BaseConfig.prototype.configure = function configure(incomingConfig) {
    merge(this._current, incomingConfig);
  };

  _createClass(BaseConfig, [{
    key: 'current',
    get: function get() {
      return this._current;
    }
  }]);

  function BaseConfig() {
    _classCallCheck(this, BaseConfig);

    this._current = {
      httpInterceptor: true,
      loginOnSignup: true,
      baseUrl: '/',
      loginRedirect: '#/',
      logoutRedirect: '#/',
      signupRedirect: '#/login',
      loginUrl: '/auth/login',
      signupUrl: '/auth/signup',
      profileUrl: '/auth/me',
      loginRoute: '/login',
      signupRoute: '/signup',
      tokenRoot: false,
      tokenName: 'token',
      idTokenName: 'id_token',
      tokenPrefix: 'aurelia',
      responseTokenProp: 'access_token',
      responseIdTokenProp: 'id_token',
      unlinkUrl: '/auth/unlink/',
      unlinkMethod: 'get',
      authHeader: 'Authorization',
      authToken: 'Bearer',
      withCredentials: true,
      platform: 'browser',
      storage: 'localStorage',
      providers: {
        identSrv: {
          name: 'identSrv',
          url: '/auth/identSrv',

          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          scope: ['profile', 'openid'],
          responseType: 'code',
          scopePrefix: '',
          scopeDelimiter: ' ',
          requiredUrlParams: ['scope', 'nonce'],
          optionalUrlParams: ['display', 'state'],
          state: function state() {
            var rand = Math.random().toString(36).substr(2);
            return encodeURIComponent(rand);
          },
          display: 'popup',
          type: '2.0',
          clientId: 'jsClient',
          nonce: function nonce() {
            var val = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
            return encodeURIComponent(val);
          },
          popupOptions: { width: 452, height: 633 }
        },
        google: {
          name: 'google',
          url: '/auth/google',
          authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          scope: ['profile', 'email'],
          scopePrefix: 'openid',
          scopeDelimiter: ' ',
          requiredUrlParams: ['scope'],
          optionalUrlParams: ['display', 'state'],
          display: 'popup',
          type: '2.0',
          state: function state() {
            var rand = Math.random().toString(36).substr(2);
            return encodeURIComponent(rand);
          },
          popupOptions: {
            width: 452,
            height: 633
          }
        },
        facebook: {
          name: 'facebook',
          url: '/auth/facebook',
          authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
          redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
          scope: ['email'],
          scopeDelimiter: ',',
          nonce: function nonce() {
            return Math.random();
          },
          requiredUrlParams: ['nonce', 'display', 'scope'],
          display: 'popup',
          type: '2.0',
          popupOptions: {
            width: 580,
            height: 400
          }
        },
        linkedin: {
          name: 'linkedin',
          url: '/auth/linkedin',
          authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          requiredUrlParams: ['state'],
          scope: ['r_emailaddress'],
          scopeDelimiter: ' ',
          state: 'STATE',
          type: '2.0',
          popupOptions: {
            width: 527,
            height: 582
          }
        },
        github: {
          name: 'github',
          url: '/auth/github',
          authorizationEndpoint: 'https://github.com/login/oauth/authorize',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          optionalUrlParams: ['scope'],
          scope: ['user:email'],
          scopeDelimiter: ' ',
          type: '2.0',
          popupOptions: {
            width: 1020,
            height: 618
          }
        },
        yahoo: {
          name: 'yahoo',
          url: '/auth/yahoo',
          authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          scope: [],
          scopeDelimiter: ',',
          type: '2.0',
          popupOptions: {
            width: 559,
            height: 519
          }
        },
        twitter: {
          name: 'twitter',
          url: '/auth/twitter',
          authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
          type: '1.0',
          popupOptions: {
            width: 495,
            height: 645
          }
        },
        live: {
          name: 'live',
          url: '/auth/live',
          authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          scope: ['wl.emails'],
          scopeDelimiter: ' ',
          requiredUrlParams: ['display', 'scope'],
          display: 'popup',
          type: '2.0',
          popupOptions: {
            width: 500,
            height: 560
          }
        },
        instagram: {
          name: 'instagram',
          url: '/auth/instagram',
          authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          requiredUrlParams: ['scope'],
          scope: ['basic'],
          scopeDelimiter: '+',
          display: 'popup',
          type: '2.0',
          popupOptions: {
            width: 550,
            height: 369
          }
        }
      }
    };
  }

  return BaseConfig;
}();

var Popup = exports.Popup = (_dec = (0, _aureliaDependencyInjection.inject)(BaseConfig), _dec(_class = function () {
  function Popup(config) {
    _classCallCheck(this, Popup);

    this.config = config.current;
    this.popupWindow = null;
    this.polling = null;
    this.url = '';
  }

  Popup.prototype.open = function open(url, windowName, options, redirectUri) {
    this.url = url;
    var optionsString = this.stringifyOptions(this.prepareOptions(options || {}));
    this.popupWindow = window.open(url, windowName, optionsString);
    if (this.popupWindow && this.popupWindow.focus) {
      this.popupWindow.focus();
    }

    return this;
  };

  Popup.prototype.eventListener = function eventListener(redirectUri) {
    var self = this;
    var promise = new Promise(function (resolve, reject) {
      self.popupWindow.addEventListener('loadstart', function (event) {
        if (event.url.indexOf(redirectUri) !== 0) {
          return;
        }

        var parser = document.createElement('a');
        parser.href = event.url;

        if (parser.search || parser.hash) {
          var queryParams = parser.search.substring(1).replace(/\/$/, '');
          var hashParams = parser.hash.substring(1).replace(/\/$/, '');
          var hash = parseQueryString(hashParams);
          var qs = parseQueryString(queryParams);

          extend(qs, hash);

          if (qs.error) {
            reject({
              error: qs.error
            });
          } else {
            resolve(qs);
          }

          self.popupWindow.close();
        }
      });

      popupWindow.addEventListener('exit', function () {
        reject({
          data: 'Provider Popup was closed'
        });
      });

      popupWindow.addEventListener('loaderror', function () {
        deferred.reject({
          data: 'Authorization Failed'
        });
      });
    });
    return promise;
  };

  Popup.prototype.pollPopup = function pollPopup() {
    var _this = this;

    var self = this;
    var promise = new Promise(function (resolve, reject) {
      _this.polling = setInterval(function () {
        try {
          var documentOrigin = document.location.host;
          var popupWindowOrigin = self.popupWindow.location.host;

          if (popupWindowOrigin === documentOrigin && (self.popupWindow.location.search || self.popupWindow.location.hash)) {
            var queryParams = self.popupWindow.location.search.substring(1).replace(/\/$/, '');
            var hashParams = self.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
            var hash = parseQueryString(hashParams);
            var qs = parseQueryString(queryParams);

            extend(qs, hash);

            if (qs.error) {
              reject({
                error: qs.error
              });
            } else {
              resolve(qs);
            }

            self.popupWindow.close();
            clearInterval(self.polling);
          }
        } catch (error) {}

        if (!self.popupWindow) {
          clearInterval(self.polling);
          reject({
            data: 'Provider Popup Blocked'
          });
        } else if (self.popupWindow.closed) {
          clearInterval(self.polling);
          reject({
            data: 'Problem poll popup'
          });
        }
      }, 35);
    });
    return promise;
  };

  Popup.prototype.prepareOptions = function prepareOptions(options) {
    var width = options.width || 500;
    var height = options.height || 500;
    return extend({
      width: width,
      height: height,
      left: window.screenX + (window.outerWidth - width) / 2,
      top: window.screenY + (window.outerHeight - height) / 2.5
    }, options);
  };

  Popup.prototype.stringifyOptions = function stringifyOptions(options) {
    var parts = [];
    forEach(options, function (value, key) {
      parts.push(key + '=' + value);
    });
    return parts.join(',');
  };

  return Popup;
}()) || _class);
var Storage = exports.Storage = (_dec2 = (0, _aureliaDependencyInjection.inject)(BaseConfig), _dec2(_class2 = function () {
  function Storage(config) {
    _classCallCheck(this, Storage);

    this.config = config.current;
    this.storage = this._getStorage(this.config.storage);
  }

  Storage.prototype.get = function get(key) {
    return this.storage.getItem(key);
  };

  Storage.prototype.set = function set(key, value) {
    return this.storage.setItem(key, value);
  };

  Storage.prototype.remove = function remove(key) {
    return this.storage.removeItem(key);
  };

  Storage.prototype._getStorage = function _getStorage(type) {
    if (type === 'localStorage') {
      if ('localStorage' in window && window.localStorage !== null) return localStorage;
      throw new Error('Local Storage is disabled or unavailable.');
    } else if (type === 'sessionStorage') {
      if ('sessionStorage' in window && window.sessionStorage !== null) return sessionStorage;
      throw new Error('Session Storage is disabled or unavailable.');
    }

    throw new Error('Invalid storage type specified: ' + type);
  };

  return Storage;
}()) || _class2);
var Authentication = exports.Authentication = (_dec3 = (0, _aureliaDependencyInjection.inject)(Storage, BaseConfig), _dec3(_class3 = function () {
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
    var _this2 = this;

    return new Promise(function (resolve) {
      _this2.storage.remove(_this2.tokenName);

      if (_this2.config.logoutRedirect && !redirect) {
        window.location.href = _this2.config.logoutRedirect;
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
}()) || _class3);
var OAuth1 = exports.OAuth1 = (_dec4 = (0, _aureliaDependencyInjection.inject)(Storage, Popup, _aureliaFetchClient.HttpClient, BaseConfig), _dec4(_class4 = function () {
  function OAuth1(storage, popup, http, config) {
    _classCallCheck(this, OAuth1);

    this.storage = storage;
    this.config = config.current;
    this.popup = popup;
    this.http = http;
    this.defaults = {
      url: null,
      name: null,
      popupOptions: null,
      redirectUri: null,
      authorizationEndpoint: null
    };
  }

  OAuth1.prototype.open = function open(options, userData) {
    var _this3 = this;

    var current = extend({}, this.defaults, options);
    var serverUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, current.url) : current.url;

    if (this.config.platform !== 'mobile') {
      this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
    }
    return this.http.fetch(serverUrl, {
      method: 'post'
    }).then(status).then(function (response) {
      if (_this3.config.platform === 'mobile') {
        _this3.popup = _this3.popup.open([current.authorizationEndpoint, _this3.buildQueryString(response)].join('?'), current.name, current.popupOptions, current.redirectUri);
      } else {
        _this3.popup.popupWindow.location = [current.authorizationEndpoint, _this3.buildQueryString(response)].join('?');
      }

      var popupListener = _this3.config.platform === 'mobile' ? _this3.popup.eventListener(current.redirectUri) : _this3.popup.pollPopup();
      return popupListener.then(function (result) {
        return _this3.exchangeForToken(result, userData, current);
      });
    });
  };

  OAuth1.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
    var data = extend({}, userData, oauthData);
    var exchangeForTokenUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, current.url) : current.url;
    var credentials = this.config.withCredentials ? 'include' : 'same-origin';

    return this.http.fetch(exchangeForTokenUrl, {
      method: 'post',
      body: (0, _aureliaFetchClient.json)(data),
      credentials: credentials
    }).then(status);
  };

  OAuth1.prototype.buildQueryString = function buildQueryString(obj) {
    var str = [];
    forEach(obj, function (value, key) {
      return str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return str.join('&');
  };

  return OAuth1;
}()) || _class4);
var FetchConfig = exports.FetchConfig = (_dec5 = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, Authentication), _dec5(_class5 = function () {
  function FetchConfig(httpClient, authService) {
    _classCallCheck(this, FetchConfig);

    this.httpClient = httpClient;
    this.auth = authService;
  }

  FetchConfig.prototype.configure = function configure() {
    var _this4 = this;

    this.httpClient.configure(function (httpConfig) {
      httpConfig.withDefaults({
        headers: {
          'Accept': 'application/json'
        }
      }).withInterceptor(_this4.auth.tokenInterceptor);
    });
  };

  return FetchConfig;
}()) || _class5);
var AuthorizeStep = exports.AuthorizeStep = (_dec6 = (0, _aureliaDependencyInjection.inject)(Authentication), _dec6(_class6 = function () {
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
}()) || _class6);
var OAuth2 = exports.OAuth2 = (_dec7 = (0, _aureliaDependencyInjection.inject)(Storage, Popup, _aureliaFetchClient.HttpClient, BaseConfig, Authentication), _dec7(_class7 = function () {
  function OAuth2(storage, popup, http, config, auth) {
    _classCallCheck(this, OAuth2);

    this.storage = storage;
    this.config = config.current;
    this.popup = popup;
    this.http = http;
    this.auth = auth;
    this.defaults = {
      url: null,
      name: null,
      state: null,
      scope: null,
      scopeDelimiter: null,
      redirectUri: null,
      popupOptions: null,
      authorizationEndpoint: null,
      responseParams: null,
      requiredUrlParams: null,
      optionalUrlParams: null,
      defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
      responseType: 'code'
    };
  }

  OAuth2.prototype.open = function open(options, userData) {
    var _this5 = this;

    var current = extend({}, this.defaults, options);

    var stateName = current.name + '_state';

    if (isFunction(current.state)) {
      this.storage.set(stateName, current.state());
    } else if (isString(current.state)) {
      this.storage.set(stateName, current.state);
    }

    var nonceName = current.name + '_nonce';

    if (isFunction(current.nonce)) {
      this.storage.set(nonceName, current.nonce());
    } else if (isString(current.nonce)) {
      this.storage.set(nonceName, current.nonce);
    }

    var url = current.authorizationEndpoint + '?' + this.buildQueryString(current);

    var openPopup = void 0;
    if (this.config.platform === 'mobile') {
      openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).eventListener(current.redirectUri);
    } else {
      openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).pollPopup();
    }

    return openPopup.then(function (oauthData) {
      if (oauthData.state && oauthData.state !== _this5.storage.get(stateName)) {
        return Promise.reject('OAuth 2.0 state parameter mismatch.');
      }

      if (current.responseType.toUpperCase().indexOf('TOKEN') !== -1) {
        if (!_this5.verifyIdToken(oauthData, current.name)) {
          return Promise.reject('OAuth 2.0 Nonce parameter mismatch.');
        }

        return oauthData;
      }

      return _this5.exchangeForToken(oauthData, userData, current);
    });
  };

  OAuth2.prototype.verifyIdToken = function verifyIdToken(oauthData, providerName) {
    var idToken = oauthData && oauthData[this.config.responseIdTokenProp];
    if (!idToken) return true;
    var idTokenObject = this.auth.decomposeToken(idToken);
    if (!idTokenObject) return true;
    var nonceFromToken = idTokenObject.nonce;
    if (!nonceFromToken) return true;
    var nonceInStorage = this.storage.get(providerName + '_nonce');
    if (nonceFromToken !== nonceInStorage) {
      return false;
    }
    return true;
  };

  OAuth2.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
    var data = extend({}, userData, {
      code: oauthData.code,
      clientId: current.clientId,
      redirectUri: current.redirectUri
    });

    if (oauthData.state) {
      data.state = oauthData.state;
    }

    forEach(current.responseParams, function (param) {
      return data[param] = oauthData[param];
    });

    var exchangeForTokenUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, current.url) : current.url;
    var credentials = this.config.withCredentials ? 'include' : 'same-origin';

    return this.http.fetch(exchangeForTokenUrl, {
      method: 'post',
      body: (0, _aureliaFetchClient.json)(data),
      credentials: credentials
    }).then(status);
  };

  OAuth2.prototype.buildQueryString = function buildQueryString(current) {
    var _this6 = this;

    var keyValuePairs = [];
    var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

    forEach(urlParams, function (params) {
      forEach(current[params], function (paramName) {
        var camelizedName = camelCase(paramName);
        var paramValue = isFunction(current[paramName]) ? current[paramName]() : current[camelizedName];

        if (paramName === 'state') {
          var stateName = current.name + '_state';
          paramValue = encodeURIComponent(_this6.storage.get(stateName));
        }

        if (paramName === 'nonce') {
          var nonceName = current.name + '_nonce';
          paramValue = encodeURIComponent(_this6.storage.get(nonceName));
        }

        if (paramName === 'scope' && Array.isArray(paramValue)) {
          paramValue = paramValue.join(current.scopeDelimiter);

          if (current.scopePrefix) {
            paramValue = [current.scopePrefix, paramValue].join(current.scopeDelimiter);
          }
        }

        keyValuePairs.push([paramName, paramValue]);
      });
    });

    return keyValuePairs.map(function (pair) {
      return pair.join('=');
    }).join('&');
  };

  return OAuth2;
}()) || _class7);
var AuthService = exports.AuthService = (_dec8 = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, Authentication, OAuth1, OAuth2, BaseConfig, _aureliaEventAggregator.EventAggregator), _dec8(_class8 = function () {
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

  AuthService.prototype.setToken = function setToken(token) {
    this.auth.setToken(Object.defineProperty({}, this.config.tokenName, { value: token }));
  };

  AuthService.prototype.signup = function signup(displayName, email, password) {
    var _this7 = this;

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
    }).then(status).then(function (response) {
      if (_this7.config.loginOnSignup) {
        _this7.auth.setToken(response);
      } else if (_this7.config.signupRedirect) {
        window.location.href = _this7.config.signupRedirect;
      }
      _this7.eventAggregator.publish('auth:signup', response);
      return response;
    });
  };

  AuthService.prototype.login = function login(email, password) {
    var _this8 = this;

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
    }).then(status).then(function (response) {
      _this8.auth.setToken(response);
      _this8.eventAggregator.publish('auth:login', response);
      return response;
    });
  };

  AuthService.prototype.logout = function logout(redirectUri) {
    var _this9 = this;

    return this.auth.logout(redirectUri).then(function () {
      _this9.eventAggregator.publish('auth:logout');
    });
  };

  AuthService.prototype.authenticate = function authenticate(name, redirect, userData) {
    var _this10 = this;

    var provider = this.oAuth2;
    if (this.config.providers[name].type === '1.0') {
      provider = this.oAuth1;
    }

    return provider.open(this.config.providers[name], userData || {}).then(function (response) {
      _this10.auth.setToken(response, redirect);
      _this10.eventAggregator.publish('auth:authenticate', response);
      return response;
    });
  };

  AuthService.prototype.unlink = function unlink(provider) {
    var _this11 = this;

    var unlinkUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

    if (this.config.unlinkMethod === 'get') {
      return this.http.fetch(unlinkUrl + provider).then(status).then(function (response) {
        _this11.eventAggregator.publish('auth:unlink', response);
        return response;
      });
    } else if (this.config.unlinkMethod === 'post') {
      return this.http.fetch(unlinkUrl, {
        method: 'post',
        body: (0, _aureliaFetchClient.json)(provider)
      }).then(status).then(function (response) {
        _this11.eventAggregator.publish('auth:unlink', response);
        return response;
      });
    }
  };

  return AuthService;
}()) || _class8);