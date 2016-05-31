'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-fetch-client', './authentication'], function (_export, _context) {
  "use strict";

  var inject, HttpClient, Authentication, _dec, _class, FetchConfig;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
    }, function (_authentication) {
      Authentication = _authentication.Authentication;
    }],
    execute: function () {
      _export('FetchConfig', FetchConfig = (_dec = inject(HttpClient, Authentication), _dec(_class = function () {
        function FetchConfig(httpClient, authService) {
          _classCallCheck(this, FetchConfig);

          this.httpClient = httpClient;
          this.auth = authService;
        }

        FetchConfig.prototype.configure = function configure() {
          var _this = this;

          this.httpClient.configure(function (httpConfig) {
            httpConfig.withDefaults({
              headers: {
                'Accept': 'application/json'
              }
            }).withInterceptor(_this.auth.tokenInterceptor);
          });
        };

        return FetchConfig;
      }()) || _class));

      _export('FetchConfig', FetchConfig);
    }
  };
});