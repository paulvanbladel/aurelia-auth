'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthFilterValueConverter = exports.FetchConfig = exports.AuthorizeStep = exports.AuthService = undefined;
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

exports.AuthService = _authService.AuthService;
exports.AuthorizeStep = _authorizeStep.AuthorizeStep;
exports.FetchConfig = _authFetchConfig.FetchConfig;
exports.AuthFilterValueConverter = _authFilter.AuthFilterValueConverter;