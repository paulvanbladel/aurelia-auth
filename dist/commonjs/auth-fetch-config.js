'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FetchConfig = undefined;

var _dec, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaFetchClient = require('aurelia-fetch-client');

var _authentication = require('./authentication');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FetchConfig = exports.FetchConfig = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication), _dec(_class = function () {
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
}()) || _class);