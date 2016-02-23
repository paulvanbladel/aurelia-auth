define(['exports', 'aurelia-dependency-injection', './authUtils', './storage', './popup', './baseConfig', 'aurelia-fetch-client'], function (exports, _aureliaDependencyInjection, _authUtils, _storage, _popup, _baseConfig, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _authUtils2 = _interopRequireDefault(_authUtils);

  var OAuth1 = (function () {
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

        var current = _authUtils2['default'].extend({}, this.defaults, options);

        var serverUrl = this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, current.url) : current.url;

        if (this.config.platform !== 'mobile') {
          this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
        }
        return this.http.fetch(serverUrl, {
          method: 'post'
        }).then(_authUtils2['default'].status).then(function (response) {
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
        var data = _authUtils2['default'].extend({}, userData, oauthData);
        var exchangeForTokenUrl = this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, current.url) : current.url;
        var credentials = this.config.withCredentials ? 'include' : 'same-origin';

        return this.http.fetch(exchangeForTokenUrl, {
          method: 'post',
          body: (0, _aureliaFetchClient.json)(data),
          credentials: credentials
        }).then(_authUtils2['default'].status);
      }
    }, {
      key: 'buildQueryString',
      value: function buildQueryString(obj) {
        var str = [];

        _authUtils2['default'].forEach(obj, function (value, key) {
          return str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        });

        return str.join('&');
      }
    }]);

    var _OAuth1 = OAuth1;
    OAuth1 = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig)(OAuth1) || OAuth1;
    return OAuth1;
  })();

  exports.OAuth1 = OAuth1;
});