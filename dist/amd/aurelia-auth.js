define(['exports', './auth-service', './authorize-step', './auth-fetch-config', './base-config', './auth-filter'], function (exports, _authService, _authorizeStep, _authFetchConfig, _baseConfig, _authFilter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FetchConfig = exports.BaseConfig = exports.AuthorizeStep = exports.AuthService = exports.AuthFilterValueConverter = undefined;
  exports.configure = configure;
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
});