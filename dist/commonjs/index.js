'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.configure = configure;

var _baseConfig = require('./baseConfig');

var _authService = require('./authService');

Object.defineProperty(exports, 'AuthService', {
	enumerable: true,
	get: function get() {
		return _authService.AuthService;
	}
});

var _authorizeStep = require('./authorizeStep');

Object.defineProperty(exports, 'AuthorizeStep', {
	enumerable: true,
	get: function get() {
		return _authorizeStep.AuthorizeStep;
	}
});

var _authFilter = require('./authFilter');

Object.defineProperty(exports, 'AuthFilterValueConverter', {
	enumerable: true,
	get: function get() {
		return _authFilter.AuthFilterValueConverter;
	}
});

function configure(aurelia, configCallback) {
	var version = 'versie 1.0.10';

	var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
	if (configCallback !== undefined && typeof configCallback === 'function') {
		configCallback(baseConfig);
	}
}

;