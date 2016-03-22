define(['exports', './baseConfig', './app.fetch-httpClient.config', './authFilter', './authService', './authorizeStep'], function (exports, _baseConfig, _appFetchHttpClientConfig, _authFilter, _authService, _authorizeStep) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.configure = configure;
  Object.defineProperty(exports, 'AuthService', {
    enumerable: true,
    get: function get() {
      return _authService.AuthService;
    }
  });
  Object.defineProperty(exports, 'AuthorizeStep', {
    enumerable: true,
    get: function get() {
      return _authorizeStep.AuthorizeStep;
    }
  });
  Object.defineProperty(exports, 'FetchConfig', {
    enumerable: true,
    get: function get() {
      return _appFetchHttpClientConfig.FetchConfig;
    }
  });

  function configure(aurelia, configCallback) {
    aurelia.globalResources('./authFilter');

    var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(baseConfig);
    }
  }
});