System.register(['./authService', './authorizeStep', './authFilter', './baseConfig'], function (_export) {
	'use strict';

	var AuthService, AuthorizeStep, AuthFilterValueConverter, BaseConfig;

	_export('configure', configure);

	function configure(aurelia, configCallback) {
		var version = 'versie 1.0.7';
		var baseConfig = aurelia.container.get(BaseConfig);
		if (configCallback !== undefined && typeof configCallback === 'function') {
			configCallback(baseConfig);
		}
	}

	return {
		setters: [function (_authService) {
			AuthService = _authService.AuthService;

			_export('AuthService', _authService.AuthService);
		}, function (_authorizeStep) {
			AuthorizeStep = _authorizeStep.AuthorizeStep;

			_export('AuthorizeStep', _authorizeStep.AuthorizeStep);
		}, function (_authFilter) {
			AuthFilterValueConverter = _authFilter.AuthFilterValueConverter;

			_export('AuthFilterValueConverter', _authFilter.AuthFilterValueConverter);
		}, function (_baseConfig) {
			BaseConfig = _baseConfig.BaseConfig;
		}],
		execute: function () {
			;
		}
	};
});