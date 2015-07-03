'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.configure = configure;

var _authService = require('./authService');

var _baseConfig = require('./baseConfig');

Object.defineProperty(exports, 'AuthService', {
	enumerable: true,
	get: function get() {
		return _authService.AuthService;
	}
});

function configure(aurelia, configCallback) {
	var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
	if (configCallback !== undefined && typeof configCallback === 'function') {
		configCallback(baseConfig);
	}
}

;