'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuth1 = undefined;

var _dec, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _authUtilities = require('./auth-utilities');

var _storage = require('./storage');

var _popup = require('./popup');

var _baseConfig = require('./base-config');

var _aureliaFetchClient = require('aurelia-fetch-client');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OAuth1 = exports.OAuth1 = (_dec = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig), _dec(_class = function () {
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
    var _this = this;

    var current = (0, _authUtilities.extend)({}, this.defaults, options);
    var serverUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;

    if (this.config.platform !== 'mobile') {
      this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
    }
    return this.http.fetch(serverUrl, {
      method: 'post'
    }).then(_authUtilities.status).then(function (response) {
      if (_this.config.platform === 'mobile') {
        _this.popup = _this.popup.open([current.authorizationEndpoint, _this.buildQueryString(response)].join('?'), current.name, current.popupOptions, current.redirectUri);
      } else {
        _this.popup.popupWindow.location = [current.authorizationEndpoint, _this.buildQueryString(response)].join('?');
      }

      var popupListener = _this.config.platform === 'mobile' ? _this.popup.eventListener(current.redirectUri) : _this.popup.pollPopup();
      return popupListener.then(function (result) {
        return _this.exchangeForToken(result, userData, current);
      });
    });
  };

  OAuth1.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
    var data = (0, _authUtilities.extend)({}, userData, oauthData);
    var exchangeForTokenUrl = this.config.baseUrl ? (0, _authUtilities.joinUrl)(this.config.baseUrl, current.url) : current.url;
    var credentials = this.config.withCredentials ? 'include' : 'same-origin';

    return this.http.fetch(exchangeForTokenUrl, {
      method: 'post',
      body: (0, _aureliaFetchClient.json)(data),
      credentials: credentials
    }).then(_authUtilities.status);
  };

  OAuth1.prototype.buildQueryString = function buildQueryString(obj) {
    var str = [];
    (0, _authUtilities.forEach)(obj, function (value, key) {
      return str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return str.join('&');
  };

  return OAuth1;
}()) || _class);