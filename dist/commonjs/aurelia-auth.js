'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FetchConfig = exports.BaseConfig = exports.AuthorizeStep = exports.AuthService = exports.AuthFilterValueConverter = undefined;
exports.configure = configure;

var _authService = require('./auth-service');

var _authorizeStep = require('./authorize-step');

var _authFetchConfig = require('./auth-fetch-config');

var _baseConfig = require('./base-config');

var _authFilter = require('./auth-filter');

function configure(aurelia, configCallback) {
  aurelia.globalResources('./auth-filter');

  var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(baseConfig);
  }
}

exports.AuthFilterValueConverter = _authFilter.AuthFilterValueConverter;
exports.AuthService = _authService.AuthService;
exports.AuthorizeStep = _authorizeStep.AuthorizeStep;
exports.BaseConfig = _baseConfig.BaseConfig;
exports.FetchConfig = _authFetchConfig.FetchConfig;