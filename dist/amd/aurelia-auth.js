define(['exports', './authService', './authorizeStep', './app.fetch-httpClient.config', './baseConfig'], function (exports, _authService, _authorizeStep, _appFetchHttpClient, _baseConfig) {
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
      return _appFetchHttpClient.FetchConfig;
    }
  });
  exports.configure = configure;
  function configure(aurelia, configCallback) {
    aurelia.globalResources('./authFilter');

    var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(baseConfig);
    }
  }
});