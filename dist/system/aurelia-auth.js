'use strict';

System.register(['./auth-service', './authorize-step', './auth-fetch-config', './base-config'], function (_export, _context) {
  var BaseConfig;
  return {
    setters: [function (_authService) {
      var _exportObj = {};
      _exportObj.AuthService = _authService.AuthService;

      _export(_exportObj);
    }, function (_authorizeStep) {
      var _exportObj2 = {};
      _exportObj2.AuthorizeStep = _authorizeStep.AuthorizeStep;

      _export(_exportObj2);
    }, function (_authFetchConfig) {
      var _exportObj3 = {};
      _exportObj3.FetchConfig = _authFetchConfig.FetchConfig;

      _export(_exportObj3);
    }, function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }],
    execute: function () {
      function configure(aurelia, configCallback) {
        aurelia.globalResources('./auth-filter');

        var baseConfig = aurelia.container.get(BaseConfig);
        if (configCallback !== undefined && typeof configCallback === 'function') {
          configCallback(baseConfig);
        }
      }

      _export('configure', configure);
    }
  };
});