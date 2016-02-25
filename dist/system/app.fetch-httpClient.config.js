System.register(['aurelia-fetch-client', 'fetch', './authentication', './baseConfig', 'aurelia-dependency-injection', './storage'], function (_export) {
  'use strict';

  var HttpClient, Authentication, BaseConfig, inject, Storage, FetchConfig;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
    }, function (_fetch) {}, function (_authentication) {
      Authentication = _authentication.Authentication;
    }, function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_storage) {
      Storage = _storage.Storage;
    }],
    execute: function () {
      FetchConfig = (function () {
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
        FetchConfig = inject(HttpClient, Authentication, Storage, BaseConfig)(FetchConfig) || FetchConfig;
        return FetchConfig;
      })();

      _export('FetchConfig', FetchConfig);
    }
  };
});