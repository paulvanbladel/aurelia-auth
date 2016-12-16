import {inject} from 'aurelia-dependency-injection';
import {HttpClient,json} from 'aurelia-fetch-client';
import {Redirect} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

let slice = [].slice;

function setHashKey(obj, h) {
  if (h) {
    obj.$$hashKey = h;
  } else {
    delete obj.$$hashKey;
  }
}

function baseExtend(dst, objs, deep) {
  let h = dst.$$hashKey;

  for (let i = 0, ii = objs.length; i < ii; ++i) {
    let obj = objs[i];
    if (!isObject(obj) && !isFunction(obj)) continue;
    let keys = Object.keys(obj);
    for (let j = 0, jj = keys.length; j < jj; j++) {
      let key = keys[j];
      let src = obj[key];

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

export function status(response) {
  if (response.status >= 200 && response.status < 400) {
    return response.json().catch(error => null);
  }

  throw response;
}

export function isDefined(value) {
  return typeof value !== 'undefined';
}

export function camelCase(name) {
  return name.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  });
}

export function parseQueryString(keyValue) {
  let key;
  let value;
  let obj = {};

  forEach((keyValue || '').split('&'), function(kv) {
    if (kv) {
      value = kv.split('=');
      key = decodeURIComponent(value[0]);
      obj[key] = isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
    }
  });

  return obj;
}

export function isString(value) {
  return typeof value === 'string';
}

export function isObject(value) {
  return value !== null && typeof value === 'object';
}

export function isFunction(value) {
  return typeof value === 'function';
}

export function joinUrl(baseUrl, url) {
  if (/^(?:[a-z]+:)?\/\//i.test(url)) {
    return url;
  }

  let joined = [baseUrl, url].join('/');
  let normalize = function(str) {
    return str
      .replace(/[\/]+/g, '/')
      .replace(/\/\?/g, '?')
      .replace(/\/\#/g, '#')
      .replace(/\:\//g, '://');
  };

  return normalize(joined);
}

export function isBlankObject(value) {
  return value !== null && typeof value === 'object' && !Object.getPrototypeOf(value);
}

export function isArrayLike(obj) {
  if (obj === null || isWindow(obj)) {
    return false;
  }
}

export function isWindow(obj) {
  return obj && obj.window === obj;
}

export function extend(dst) {
  return baseExtend(dst, slice.call(arguments, 1), false);
}

export function merge(dst) {
  return baseExtend(dst, slice.call(arguments, 1), true);
}

export function forEach(obj, iterator, context) {
  let key;
  let length;
  if (obj) {
    if (isFunction(obj)) {
      for (key in obj) {
        // Need to check if hasOwnProperty exists,
        // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
        if (key !== 'prototype' && key !== 'length' && key !== 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (Array.isArray(obj) || isArrayLike(obj)) {
      let isPrimitive = typeof obj !== 'object';
      for (key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
      obj.forEach(iterator, context, obj);
    } else if (isBlankObject(obj)) {
      // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
      for (key in obj) {
        iterator.call(context, obj[key], key, obj);
      }
    } else if (typeof obj.hasOwnProperty === 'function') {
      // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else {
      // Slow path for objects which do not have a method `hasOwnProperty`
      for (key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    }
  }
  return obj;
}

export class AuthFilterValueConverter {
  toView(routes, isAuthenticated) {
    return routes.filter(r => r.config.auth === undefined || r.config.auth === isAuthenticated);
  }
}

export class BaseConfig {
  configure(incomingConfig) {
    merge(this._current, incomingConfig);
  }

  get current() {
    return this._current;
  }

  constructor() {
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
          //authorizationEndpoint: 'http://localhost:22530/connect/authorize',
          redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
          scope: ['profile', 'openid'],
          responseType: 'code',
          scopePrefix: '',
          scopeDelimiter: ' ',
          requiredUrlParams: ['scope', 'nonce'],
          optionalUrlParams: ['display', 'state'],
          state: function() {
            let rand = Math.random().toString(36).substr(2);
            return encodeURIComponent(rand);
          },
          display: 'popup',
          type: '2.0',
          clientId: 'jsClient',
          nonce: function() {
            let val = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
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
          state: function() {
            let rand = Math.random().toString(36).substr(2);
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
          nonce: function() {
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
}

@inject(BaseConfig)
export class Popup {
  constructor(config) {
    this.config = config.current;
    this.popupWindow = null;
    this.polling = null;
    this.url = '';
  }

  open(url, windowName, options, redirectUri) {
    this.url = url;
    let optionsString = this.stringifyOptions(this.prepareOptions(options || {}));
    this.popupWindow = window.open(url, windowName, optionsString);
    if (this.popupWindow && this.popupWindow.focus) {
      this.popupWindow.focus();
    }

    return this;
  }

  eventListener(redirectUri) {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      self.popupWindow.addEventListener('loadstart', (event) => {
        if (event.url.indexOf(redirectUri) !== 0) {
          return;
        }

        let parser = document.createElement('a');
        parser.href = event.url;

        if (parser.search || parser.hash) {
          let queryParams = parser.search.substring(1).replace(/\/$/, '');
          let hashParams = parser.hash.substring(1).replace(/\/$/, '');
          let hash = parseQueryString(hashParams);
          let qs = parseQueryString(queryParams);

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

      popupWindow.addEventListener('exit', () => {
        reject({
          data: 'Provider Popup was closed'
        });
      });

      popupWindow.addEventListener('loaderror', () => {
        deferred.reject({
          data: 'Authorization Failed'
        });
      });
    });
    return promise;
  }

  pollPopup() {
    let self = this;
    let promise = new Promise((resolve, reject) => {
      this.polling = setInterval(() => {
        try {
          let documentOrigin = document.location.host;
          let popupWindowOrigin = self.popupWindow.location.host;

          if (popupWindowOrigin === documentOrigin && (self.popupWindow.location.search || self.popupWindow.location.hash)) {
            let queryParams = self.popupWindow.location.search.substring(1).replace(/\/$/, '');
            let hashParams = self.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
            let hash = parseQueryString(hashParams);
            let qs = parseQueryString(queryParams);

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
        } catch (error) {
          // no-op
        }

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
  }

  prepareOptions(options) {
    let width = options.width || 500;
    let height = options.height || 500;
    return extend({
      width: width,
      height: height,
      left: window.screenX + ((window.outerWidth - width) / 2),
      top: window.screenY + ((window.outerHeight - height) / 2.5)
    }, options);
  }

  stringifyOptions(options) {
    let parts = [];
    forEach(options, function(value, key) {
      parts.push(key + '=' + value);
    });
    return parts.join(',');
  }
}

@inject(BaseConfig)
export class Storage {
  constructor(config) {
    this.config = config.current;
    this.storage = this._getStorage(this.config.storage);
  }

  get(key) { return this.storage.getItem(key); }
  set(key, value) { return this.storage.setItem(key, value); }
  remove(key) { return this.storage.removeItem(key); }
  _getStorage(type) {
    if (type === 'localStorage') {
      if ('localStorage' in window && window.localStorage !== null) return localStorage;
      throw new Error('Local Storage is disabled or unavailable.');
    } else if (type === 'sessionStorage') {
      if ('sessionStorage' in window && window.sessionStorage !== null) return sessionStorage;
      throw new Error('Session Storage is disabled or unavailable.');
    }

    throw new Error('Invalid storage type specified: ' + type);
  }
}

@inject(Storage, BaseConfig)
export class Authentication {
  constructor(storage, config) {
    this.storage = storage;
    this.config = config.current;
    this.tokenName = this.config.tokenPrefix ?
      this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
    this.idTokenName = this.config.tokenPrefix ?
      this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
  }

  getLoginRoute() {
    return this.config.loginRoute;
  }

  getLoginRedirect() {
    return this.initialUrl || this.config.loginRedirect;
  }

  getLoginUrl() {
    return this.config.baseUrl ?
      joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
  }

  getSignupUrl() {
    return this.config.baseUrl ?
      joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
  }

  getProfileUrl() {
    return this.config.baseUrl ?
      joinUrl(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
  }

  getToken() {
    return this.storage.get(this.tokenName);
  }

  getPayload() {
    let token = this.storage.get(this.tokenName);
    return this.decomposeToken(token);
  }

  decomposeToken(token) {
    if (token && token.split('.').length === 3) {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      try {
        return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
      } catch (error) {
        return null;
      }
    }
  }

  setInitialUrl(url) {
    this.initialUrl = url;
  }

  setToken(response, redirect) {
    // access token handling
    let accessToken = response && response[this.config.responseTokenProp];
    let tokenToStore;

    if (accessToken) {
      if (isObject(accessToken) && isObject(accessToken.data)) {
        response = accessToken;
      } else if (isString(accessToken)) {
        tokenToStore = accessToken;
      }
    }

    if (!tokenToStore && response) {
      tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ?
        response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
    }

    if (tokenToStore) {
      this.storage.set(this.tokenName, tokenToStore);
    }

    // id token handling
    let idToken = response && response[this.config.responseIdTokenProp];

    if (idToken) {
      this.storage.set(this.idTokenName, idToken);
    }

    if (this.config.loginRedirect && !redirect) {
      window.location.href = this.getLoginRedirect();
    } else if (redirect && isString(redirect)) {
      window.location.href = window.encodeURI(redirect);
    }
  }

  removeToken() {
    this.storage.remove(this.tokenName);
  }

  isAuthenticated() {
    let token = this.storage.get(this.tokenName);

    // There's no token, so user is not authenticated.
    if (!token) {
      return false;
    }

    // There is a token, but in a different format. Return true.
    if (token.split('.').length !== 3) {
      return true;
    }

    let exp;
    try {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      exp = JSON.parse(window.atob(base64)).exp;
    } catch (error) {
      return false;
    }

    if (exp) {
      return Math.round(new Date().getTime() / 1000) <= exp;
    }

    return true;
  }

  logout(redirect) {
    return new Promise(resolve => {
      this.storage.remove(this.tokenName);

      if (this.config.logoutRedirect && !redirect) {
        window.location.href = this.config.logoutRedirect;
      } else if (isString(redirect)) {
        window.location.href = redirect;
      }

      resolve();
    });
  }

  get tokenInterceptor() {
    let config = this.config;
    let storage = this.storage;
    let auth = this;
    return {
      request(request) {
        if (auth.isAuthenticated() && config.httpInterceptor) {
          let tokenName = config.tokenPrefix ? `${config.tokenPrefix}_${config.tokenName}` : config.tokenName;
          let token = storage.get(tokenName);

          if (config.authHeader && config.authToken) {
            token = `${config.authToken} ${token}`;
          }

          request.headers.set(config.authHeader, token);
        }
        return request;
      }
    };
  }
}

@inject(Storage, Popup, HttpClient, BaseConfig)
export class OAuth1 {
  constructor(storage, popup, http, config) {
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

  open(options, userData) {
    let current = extend({}, this.defaults, options);
    let serverUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, current.url) : current.url;

    if (this.config.platform !== 'mobile') {
      this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
    }
    return this.http.fetch(serverUrl, {
      method: 'post'
    })
      .then(status)
      .then(response => {
        if (this.config.platform === 'mobile') {
          this.popup = this.popup.open(
            [
              current.authorizationEndpoint,
              this.buildQueryString(response)
            ].join('?'),
            current.name,
            current.popupOptions,
            current.redirectUri);
        } else {
          this.popup.popupWindow.location = [
            current.authorizationEndpoint,
            this.buildQueryString(response)
          ].join('?');
        }

        let popupListener = this.config.platform === 'mobile' ?
          this.popup.eventListener(current.redirectUri) : this.popup.pollPopup();
        return popupListener
          .then(result => this.exchangeForToken(result, userData, current));
      });
  }

  exchangeForToken(oauthData, userData, current) {
    let data                = extend({}, userData, oauthData);
    let exchangeForTokenUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, current.url) : current.url;
    let credentials         = this.config.withCredentials ? 'include' : 'same-origin';

    return this.http.fetch(exchangeForTokenUrl, {
      method: 'post',
      body: json(data),
      credentials: credentials
    }).then(status);
  }

  buildQueryString(obj) {
    let str = [];
    forEach(obj, (value, key) => str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value)));
    return str.join('&');
  }
}

@inject(HttpClient, Authentication )
export class FetchConfig {
  constructor(httpClient, authService) {
    this.httpClient = httpClient;
    this.auth = authService;
  }

  configure() {
    this.httpClient.configure(httpConfig => {
      httpConfig
        .withDefaults({
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .withInterceptor(this.auth.tokenInterceptor);
    });
  }
}

@inject(Authentication)
export class AuthorizeStep {
  constructor(auth) {
    this.auth = auth;
  }
  run(routingContext, next) {
    let isLoggedIn = this.auth.isAuthenticated();
    let loginRoute = this.auth.getLoginRoute();

    if (routingContext.getAllInstructions().some(i => i.config.auth)) {
      if (!isLoggedIn) {
        this.auth.setInitialUrl(window.location.href);
        return next.cancel(new Redirect(loginRoute));
      }
    } else if (isLoggedIn && routingContext.getAllInstructions().some(i => i.fragment === loginRoute)) {
      let loginRedirect = this.auth.getLoginRedirect();
      return next.cancel(new Redirect(loginRedirect));
    }

    return next();
  }
}

@inject(Storage, Popup, HttpClient, BaseConfig, Authentication)
export class OAuth2 {
  constructor(storage, popup, http, config, auth) {
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

  open(options, userData) {
    let current = extend({}, this.defaults, options);

    //state handling
    let stateName = current.name + '_state';

    if (isFunction(current.state)) {
      this.storage.set(stateName, current.state());
    } else if (isString(current.state)) {
      this.storage.set(stateName, current.state);
    }

    //nonce handling
    let nonceName = current.name + '_nonce';

    if (isFunction(current.nonce)) {
      this.storage.set(nonceName, current.nonce());
    } else if (isString(current.nonce)) {
      this.storage.set(nonceName, current.nonce);
    }

    let url = current.authorizationEndpoint + '?' + this.buildQueryString(current);

    let openPopup;
    if (this.config.platform === 'mobile') {
      openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).eventListener(current.redirectUri);
    } else {
      openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).pollPopup();
    }

    return openPopup
      .then(oauthData => {
        if (oauthData.state && oauthData.state !== this.storage.get(stateName)) {
          return Promise.reject('OAuth 2.0 state parameter mismatch.');
        }

        if (current.responseType.toUpperCase().indexOf('TOKEN') !== -1) { //meaning implicit flow or hybrid flow
          if (!this.verifyIdToken(oauthData, current.name)) {
            return Promise.reject('OAuth 2.0 Nonce parameter mismatch.');
          }

          return oauthData;
        }

        return this.exchangeForToken(oauthData, userData, current); //responseType is authorization code only (no token nor id_token)
      });
  }

  verifyIdToken(oauthData, providerName) {
    let idToken = oauthData && oauthData[this.config.responseIdTokenProp];
    if (!idToken) return true;
    let idTokenObject = this.auth.decomposeToken(idToken);
    if (!idTokenObject) return true;
    let nonceFromToken = idTokenObject.nonce;
    if (!nonceFromToken) return true;
    let nonceInStorage = this.storage.get(providerName + '_nonce');
    if (nonceFromToken !== nonceInStorage) {
      return false;
    }
    return true;
  }

  exchangeForToken(oauthData, userData, current) {
    let data = extend({}, userData, {
      code: oauthData.code,
      clientId: current.clientId,
      redirectUri: current.redirectUri
    });

    if (oauthData.state) {
      data.state = oauthData.state;
    }

    forEach(current.responseParams, param => data[param] = oauthData[param]);

    let exchangeForTokenUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, current.url) : current.url;
    let credentials         = this.config.withCredentials ? 'include' : 'same-origin';

    return this.http.fetch(exchangeForTokenUrl, {
      method: 'post',
      body: json(data),
      credentials: credentials
    }).then(status);
  }

  buildQueryString(current) {
    let keyValuePairs = [];
    let urlParams     = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

    forEach(urlParams, params => {
      forEach(current[params], paramName => {
        let camelizedName = camelCase(paramName);
        let paramValue    = isFunction(current[paramName]) ? current[paramName]() : current[camelizedName];

        if (paramName === 'state') {
          let stateName = current.name + '_state';
          paramValue    = encodeURIComponent(this.storage.get(stateName));
        }

        if (paramName === 'nonce') {
          let nonceName = current.name + '_nonce';
          paramValue    = encodeURIComponent(this.storage.get(nonceName));
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

    return keyValuePairs.map(pair => pair.join('=')).join('&');
  }
}

@inject(HttpClient, Authentication, OAuth1, OAuth2, BaseConfig, EventAggregator)
export class AuthService {
  constructor(http, auth, oAuth1, oAuth2, config, eventAggregator) {
    this.http = http;
    this.auth = auth;
    this.oAuth1 = oAuth1;
    this.oAuth2 = oAuth2;
    this.config = config.current;
    this.tokenInterceptor = auth.tokenInterceptor;
    this.eventAggregator = eventAggregator;
  }

  getMe() {
    let profileUrl = this.auth.getProfileUrl();
    return this.http.fetch(profileUrl)
      .then(status);
  }

  isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  getTokenPayload() {
    return this.auth.getPayload();
  }

  setToken(token) {
    this.auth.setToken(Object.defineProperty( {}, this.config.tokenName, { value: token } ));
  }

  signup(displayName, email, password) {
    let signupUrl = this.auth.getSignupUrl();
    let content;
    if (typeof arguments[0] === 'object') {
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
    })
      .then(status)
      .then((response) => {
        if (this.config.loginOnSignup) {
          this.auth.setToken(response);
        } else if (this.config.signupRedirect) {
          window.location.href = this.config.signupRedirect;
        }
        this.eventAggregator.publish('auth:signup', response);
        return response;
      });
  }

  login(email, password) {
    let loginUrl = this.auth.getLoginUrl();
    let content;
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
      headers: typeof(content) === 'string' ? {'Content-Type': 'application/x-www-form-urlencoded'} : {},
      body: typeof(content) === 'string' ? content : json(content)
    })
      .then(status)
      .then((response) => {
        this.auth.setToken(response);
        this.eventAggregator.publish('auth:login', response);
        return response;
      });
  }

  logout(redirectUri) {
    return this.auth.logout(redirectUri)
      .then(() => {
        this.eventAggregator.publish('auth:logout');
      });
  }

  authenticate(name, redirect, userData) {
    let provider = this.oAuth2;
    if (this.config.providers[name].type === '1.0') {
      provider = this.oAuth1;
    }

    return provider.open(this.config.providers[name], userData || {})
      .then((response) => {
        this.auth.setToken(response, redirect);
        this.eventAggregator.publish('auth:authenticate', response);
        return response;
      });
  }

  unlink(provider) {
    let unlinkUrl = this.config.baseUrl ?
      joinUrl(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;


    if (this.config.unlinkMethod === 'get') {
      return this.http.fetch(unlinkUrl + provider)
        .then(status)
        .then(response => {
          this.eventAggregator.publish('auth:unlink', response);
          return response;
        });
    } else if (this.config.unlinkMethod === 'post') {
      return this.http.fetch(unlinkUrl, {
        method: 'post',
        body: json(provider)
      }).then(status)
      .then(response => {
        this.eventAggregator.publish('auth:unlink', response);
        return response;
      });
    }
  }
}
