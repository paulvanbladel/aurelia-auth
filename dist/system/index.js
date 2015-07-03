System.register(['./baseConfig', './authService', './authorizeStep', './authFilter'], function (_export) {
	'use strict';

	var BaseConfig;

	_export('configure', configure);

	function configure(aurelia, configCallback) {
		var version = 'versie 1.0.10';

		var baseConfig = aurelia.container.get(BaseConfig);
		if (configCallback !== undefined && typeof configCallback === 'function') {
			configCallback(baseConfig);
		}
	}

	return {
		setters: [function (_baseConfig) {
			BaseConfig = _baseConfig.BaseConfig;
		}, function (_authService) {
			_export('AuthService', _authService.AuthService);
		}, function (_authorizeStep) {
			_export('AuthorizeStep', _authorizeStep.AuthorizeStep);
		}, function (_authFilter) {
			_export('AuthFilterValueConverter', _authFilter.AuthFilterValueConverter);
		}],
		execute: function () {
			;
		}
	};
});