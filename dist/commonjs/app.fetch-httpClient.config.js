'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaFetchClient = require('aurelia-fetch-client');

var _authentication = require('./authentication');

var _baseConfig = require('./baseConfig');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _storage = require('./storage');

var FetchConfig = (function () {
  function FetchConfig(httpClient, authService, storage, config) {
    _classCallCheck(this, _FetchConfig);

    this.httpClient = httpClient;
    this.auth = authService;
    this.storage = storage;
    this.config = config.current;
  }

  _createClass(FetchConfig, [{
    key: 'configure',
    value: function configure() {
      var _this = this;

      this.httpClient.configure(function (httpConfig) {
        httpConfig.withDefaults({
          headers: {
            'Accept': 'application/json'
          }
        }).withInterceptor({
          request: function request(_request) {
            if (_this.auth.isAuthenticated() && _this.config.httpInterceptor) {
              var token = _this.auth.token;
              if (_this.config.authHeader && _this.config.authToken) {
                token = _this.config.authToken + ' ' + _this.auth.token;
              }
              _request.headers.append(_this.config.authHeader, token);
            }
            return _request;
          }
        });
      });
    }
  }]);

  var _FetchConfig = FetchConfig;
  FetchConfig = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication, _storage.Storage, _baseConfig.BaseConfig)(FetchConfig) || FetchConfig;
  return FetchConfig;
})();

exports.FetchConfig = FetchConfig;