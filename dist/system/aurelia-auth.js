'use strict';

System.register(['./auth-service', './authorize-step', './auth-fetch-config', './base-config', './auth-filter'], function (_export, _context) {
  "use strict";

  var AuthService, AuthorizeStep, FetchConfig, BaseConfig, AuthFilterValueConverter;
  function configure(aurelia, configCallback) {
    aurelia.globalResources('./auth-filter');

    var baseConfig = aurelia.container.get(BaseConfig);
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(baseConfig);
    }
  }

  _export('configure', configure);

  return {
    setters: [function (_authService) {
      AuthService = _authService.AuthService;
    }, function (_authorizeStep) {
      AuthorizeStep = _authorizeStep.AuthorizeStep;
    }, function (_authFetchConfig) {
      FetchConfig = _authFetchConfig.FetchConfig;
    }, function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }, function (_authFilter) {
      AuthFilterValueConverter = _authFilter.AuthFilterValueConverter;
    }],
    execute: function () {
      _export('AuthFilterValueConverter', AuthFilterValueConverter);

      _export('AuthService', AuthService);

      _export('AuthorizeStep', AuthorizeStep);

      _export('BaseConfig', BaseConfig);

      _export('FetchConfig', FetchConfig);
    }
  };
});