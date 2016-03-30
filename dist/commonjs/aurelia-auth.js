'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FetchConfig = exports.AuthorizeStep = exports.AuthService = undefined;

var _authService = require('./auth-service');

Object.defineProperty(exports, 'AuthService', {
  enumerable: true,
  get: function get() {
    return _authService.AuthService;
  }
});

var _authorizeStep = require('./authorize-step');

Object.defineProperty(exports, 'AuthorizeStep', {
  enumerable: true,
  get: function get() {
    return _authorizeStep.AuthorizeStep;
  }
});

var _authFetchConfig = require('./auth-fetch-config');

Object.defineProperty(exports, 'FetchConfig', {
  enumerable: true,
  get: function get() {
    return _authFetchConfig.FetchConfig;
  }
});
exports.configure = configure;

var _baseConfig = require('./base-config');

function configure(aurelia, configCallback) {
  aurelia.globalResources('./auth-filter');

  var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(baseConfig);
  }
}