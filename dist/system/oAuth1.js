'use strict';

System.register(['aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', 'aurelia-fetch-client'], function (_export, _context) {
  "use strict";

  var inject, extend, forEach, joinUrl, status, Storage, Popup, BaseConfig, HttpClient, json, _dec, _class, OAuth1;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_authUtilities) {
      extend = _authUtilities.extend;
      forEach = _authUtilities.forEach;
      joinUrl = _authUtilities.joinUrl;
      status = _authUtilities.status;
    }, function (_storage) {
      Storage = _storage.Storage;
    }, function (_popup) {
      Popup = _popup.Popup;
    }, function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }, function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
      json = _aureliaFetchClient.json;
    }],
    execute: function () {
      _export('OAuth1', OAuth1 = (_dec = inject(Storage, Popup, HttpClient, BaseConfig), _dec(_class = function () {
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

          var current = extend({}, this.defaults, options);
          var serverUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, current.url) : current.url;

          if (this.config.platform !== 'mobile') {
            this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
          }
          return this.http.fetch(serverUrl, {
            method: 'post'
          }).then(status).then(function (response) {
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
          var data = extend({}, userData, oauthData);
          var exchangeForTokenUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, current.url) : current.url;
          var credentials = this.config.withCredentials ? 'include' : 'same-origin';

          return this.http.fetch(exchangeForTokenUrl, {
            method: 'post',
            body: json(data),
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
      }()) || _class));

      _export('OAuth1', OAuth1);
    }
  };
});