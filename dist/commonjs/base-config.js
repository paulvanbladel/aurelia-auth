'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _authUtilities = require('./auth-utilities');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseConfig = exports.BaseConfig = function () {
  BaseConfig.prototype.configure = function configure(incomingConfig) {
    (0, _authUtilities.merge)(this._current, incomingConfig);
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