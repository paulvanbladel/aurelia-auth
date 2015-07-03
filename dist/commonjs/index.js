'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.configure = configure;

var _authService = require('./authService');

var _authorizeStep = require('./authorizeStep');

var _authFilter = require('./authFilter');

var _baseConfig = require('./baseConfig');

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
Object.defineProperty(exports, 'AuthFilterValueConverter', {
	enumerable: true,
	get: function get() {
		return _authFilter.AuthFilterValueConverter;
	}
});

function configure(aurelia, configCallback) {
	var version = 'versie 1.0.7';
	var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
	if (configCallback !== undefined && typeof configCallback === 'function') {
		configCallback(baseConfig);
	}
}

;