System.register(['./baseConfig', './authService', './authorizeStep'], function (_export) {
	'use strict';

	var BaseConfig;

	_export('configure', configure);

	function configure(aurelia, configCallback) {
		aurelia.globalizeResources('./authFilter');

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
		}],
		execute: function () {
			;
		}
	};
});