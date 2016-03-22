System.register(['./baseConfig', './app.fetch-httpClient.config', './authFilter', './authService', './authorizeStep'], function (_export) {
  'use strict';

  var BaseConfig, FetchConfig;

  _export('configure', configure);

  function configure(aurelia, configCallback) {
    aurelia.globalResources('./authFilter');

    var baseConfig = aurelia.container.get(BaseConfig);
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(baseConfig);
    }
  }

  return {
    setters: [function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }, function (_appFetchHttpClientConfig) {
      FetchConfig = _appFetchHttpClientConfig.FetchConfig;

      _export('FetchConfig', _appFetchHttpClientConfig.FetchConfig);
    }, function (_authFilter) {}, function (_authService) {
      _export('AuthService', _authService.AuthService);
    }, function (_authorizeStep) {
      _export('AuthorizeStep', _authorizeStep.AuthorizeStep);
    }],
    execute: function () {}
  };
});