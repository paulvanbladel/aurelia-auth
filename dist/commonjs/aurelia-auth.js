'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FetchConfig = exports.AuthorizeStep = exports.AuthService = undefined;

var _authService = require('./authService');

Object.defineProperty(exports, 'AuthService', {
  enumerable: true,
  get: function get() {
    return _authService.AuthService;
  }
});

var _authorizeStep = require('./authorizeStep');

Object.defineProperty(exports, 'AuthorizeStep', {
  enumerable: true,
  get: function get() {
    return _authorizeStep.AuthorizeStep;
  }
});

var _appFetchHttpClient = require('./app.fetch-httpClient.config');

Object.defineProperty(exports, 'FetchConfig', {
  enumerable: true,
  get: function get() {
    return _appFetchHttpClient.FetchConfig;
  }
});
exports.configure = configure;

var _baseConfig = require('./baseConfig');

function configure(aurelia, configCallback) {
  aurelia.globalResources('./authFilter');

  var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(baseConfig);
  }
}