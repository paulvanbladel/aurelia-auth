'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaFramework = require('aurelia-framework');

var _baseConfig = require('./baseConfig');

var _storage = require('./storage');

var _authUtils = require('./authUtils');

var _authUtils2 = _interopRequireDefault(_authUtils);

var Authentication = (function () {
  function Authentication(storage, config) {
    _classCallCheck(this, _Authentication);

    this.storage = storage;
    this.config = config.current;
    this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
  }

  var _Authentication = Authentication;

  _createClass(_Authentication, [{
    key: 'getLoginUrl',
    value: function getLoginUrl() {
      return this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
    }
  }, {
    key: 'getSignupUrl',
    value: function getSignupUrl() {
      return this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
    }
  }, {
    key: 'getProfileUrl',
    value: function getProfileUrl() {
      return this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
    }
  }, {
    key: 'getToken',
    value: function getToken() {
      return this.storage.get(this.tokenName);
    }
  }, {
    key: 'getPayload',
    value: function getPayload() {
      var token = this.storage.get(this.tokenName);

      if (token && token.split('.').length === 3) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
      }
    }
  }, {
    key: 'setToken',
    value: function setToken(response, redirect) {

      var tokenName = this.tokenName;
      var accessToken = response && response.access_token;
      var token;

      if (accessToken) {
        if (_authUtils2['default'].isObject(accessToken) && _authUtils2['default'].isObject(accessToken.data)) {
          response = accessToken;
        } else if (_authUtils2['default'].isString(accessToken)) {
          token = accessToken;
        }
      }

      if (!token && response) {
        token = this.config.tokenRoot && response.content[this.config.tokenRoot] ? response.content[this.config.tokenRoot][this.config.tokenName] : response.content[this.config.tokenName];
      }

      if (!token) {
        var tokenPath = this.config.tokenRoot ? this.config.tokenRoot + '.' + this.config.tokenName : this.config.tokenName;

        throw new Error('Expecting a token named "' + tokenPath + '" but instead got: ' + JSON.stringify(response.content));
      }

      this.storage.set(tokenName, token);

      if (this.config.loginRedirect && !redirect) {
        window.location.href = this.config.loginRedirect;
      } else if (redirect && _authUtils2['default'].isString(redirect)) {
        window.location.href = window.encodeURI(redirect);
      }
    }
  }, {
    key: 'removeToken',
    value: function removeToken() {
      this.storage.remove(this.tokenName);
    }
  }, {
    key: 'isAuthenticated',
    value: function isAuthenticated() {
      var token = this.storage.get(this.tokenName);

      if (token) {
        if (token.split('.').length === 3) {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          var exp = JSON.parse(window.atob(base64)).exp;
          if (exp) {
            return Math.round(new Date().getTime() / 1000) <= exp;
          }
          return true;
        }
        return true;
      }
      return false;
    }
  }, {
    key: 'logout',
    value: function logout(redirect) {
      var _this = this;

      var tokenName = this.tokenName;
      return new Promise(function (resolve, reject) {
        _this.storage.remove(tokenName);

        if (_this.config.logoutRedirect && !redirect) {
          window.location.href = _this.config.logoutRedirect;
        } else if (_authUtils2['default'].isString(redirect)) {
          window.location.href = redirect;
        }
        resolve();
      });
    }
  }]);

  Authentication = (0, _aureliaFramework.inject)(_storage.Storage, _baseConfig.BaseConfig)(Authentication) || Authentication;
  return Authentication;
})();

exports.Authentication = Authentication;