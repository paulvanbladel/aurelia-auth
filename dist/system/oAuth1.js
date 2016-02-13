System.register(['aurelia-dependency-injection', './authUtils', './storage', './popup', './baseConfig', 'aurelia-fetch-client'], function (_export) {
  'use strict';

  var inject, authUtils, Storage, Popup, BaseConfig, HttpClient, json, OAuth1;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_authUtils) {
      authUtils = _authUtils['default'];
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
      OAuth1 = (function () {
        function OAuth1(storage, popup, http, config) {
          _classCallCheck(this, _OAuth1);

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

        _createClass(OAuth1, [{
          key: 'open',
          value: function open(options, userData) {
            var _this = this;

            var current = authUtils.extend({}, this.defaults, options);

            var serverUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, current.url) : current.url;

            if (this.config.platform !== 'mobile') {
              this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
            }
            return this.http.fetch(serverUrl, {
              method: 'post'
            }).then(status).then(toJson).then(function (response) {
              if (_this.config.platform === 'mobile') {
                _this.popup = _this.popup.open([current.authorizationEndpoint, _this.buildQueryString(response.content)].join('?'), current.name, current.popupOptions, current.redirectUri);
              } else {
                _this.popup.popupWindow.location = [current.authorizationEndpoint, _this.buildQueryString(response.content)].join('?');
              }

              var popupListener = _this.config.platform === 'mobile' ? _this.popup.eventListener(current.redirectUri) : _this.popup.pollPopup();

              return popupListener.then(function (result) {
                return _this.exchangeForToken(result, userData, current);
              });
            });
          }
        }, {
          key: 'exchangeForToken',
          value: function exchangeForToken(oauthData, userData, current) {
            var data = authUtils.extend({}, userData, oauthData);
            var exchangeForTokenUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, current.url) : current.url;
            var credentials = this.config.withCredentials ? 'include' : 'same-origin';

            return this.http.fetch(exchangeForTokenUrl, {
              method: 'post',
              body: json(data),
              credentials: credentials
            }).then(status).then(toJson);
          }
        }, {
          key: 'buildQueryString',
          value: function buildQueryString(obj) {
            var str = [];

            authUtils.forEach(obj, function (value, key) {
              return str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            });

            return str.join('&');
          }
        }]);

        var _OAuth1 = OAuth1;
        OAuth1 = inject(Storage, Popup, HttpClient, BaseConfig)(OAuth1) || OAuth1;
        return OAuth1;
      })();

      _export('OAuth1', OAuth1);
    }
  };
});