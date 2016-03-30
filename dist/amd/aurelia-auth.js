define(['exports', './auth-service', './authorize-step', './auth-fetch-config', './base-config'], function (exports, _authService, _authorizeStep, _authFetchConfig, _baseConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FetchConfig = exports.AuthorizeStep = exports.AuthService = undefined;
  Object.defineProperty(exports, 'AuthService', {
    enumerable: true,
    get: function () {
      return _authService.AuthService;
    }
  });
  Object.defineProperty(exports, 'AuthorizeStep', {
    enumerable: true,
    get: function () {
      return _authorizeStep.AuthorizeStep;
    }
  });
  Object.defineProperty(exports, 'FetchConfig', {
    enumerable: true,
    get: function () {
      return _authFetchConfig.FetchConfig;
    }
  });
  exports.configure = configure;
  function configure(aurelia, configCallback) {
    aurelia.globalResources('./auth-filter');

    var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(baseConfig);
    }
  }
});