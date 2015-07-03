System.register(['./authService', './baseConfig'], function (_export) {
	'use strict';

	var AuthService, BaseConfig;

	_export('configure', configure);

	function configure(aurelia, configCallback) {
		var version = 'versie 1.0.6';
		var baseConfig = aurelia.container.get(BaseConfig);
		if (configCallback !== undefined && typeof configCallback === 'function') {
			configCallback(baseConfig);
		}
	}

	return {
		setters: [function (_authService) {
			AuthService = _authService.AuthService;

			_export('AuthService', _authService.AuthService);
		}, function (_baseConfig) {
			BaseConfig = _baseConfig.BaseConfig;
		}],
		execute: function () {
			;
		}
	};
});