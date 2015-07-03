define(['exports', './authFilter', './baseConfig', './authService', './authorizeStep'], function (exports, _authFilter, _baseConfig, _authService, _authorizeStep) {
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

	function configure(aurelia, configCallback) {
		var version = 'versie 1.0.15';

		aurelia.withResources(_authFilter.AuthFilterValueConverter);

		var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
		if (configCallback !== undefined && typeof configCallback === 'function') {
			configCallback(baseConfig);
		}
	}

	;
});