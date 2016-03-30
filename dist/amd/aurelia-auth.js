define(['exports', './auth-service', './authorize-step', './auth-fetch-config', './base-config', './auth-filter'], function (exports, _authService, _authorizeStep, _authFetchConfig, _baseConfig, _authFilter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthFilterValueConverter = exports.FetchConfig = exports.AuthorizeStep = exports.AuthService = undefined;
  exports.configure = configure;
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
});