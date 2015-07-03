define(['exports', 'module', 'aurelia-http-client', './authenticationInterceptor', './baseConfig', './authentication', './storage', 'aurelia-framework'], function (exports, module, _aureliaHttpClient, _authenticationInterceptor, _baseConfig, _authentication, _storage, _aureliaFramework) {
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _default = (function () {
		var _class = function _default(http, auth, storage, config) {
			_classCallCheck(this, _class2);

			this.http = http;
			this.auth = auth;
			this.storage = storage;
			this.config = config.current;
		};

		var _class2 = _class;

		_createClass(_class2, [{
			key: 'configure',
			value: function configure() {
				var _this = this;

				_aureliaHttpClient.RequestBuilder.addHelper('authTokenHandling', function () {
					return function (client, processor, message) {
						if (_this.auth.isAuthenticated() && _this.config.httpInterceptor) {
							var tokenName = _this.config.tokenPrefix ? _this.config.tokenPrefix + '_' + _this.config.tokenName : _this.config.tokenName;
							var token = _this.storage.get(tokenName);

							if (_this.config.authHeader && _this.config.authToken) {
								token = _this.config.authToken + ' ' + token;
							}

							message.headers.add(_this.config.authHeader, token);
						}
					};
				});

				this.http.configure(function (x) {
					x.authTokenHandling();
					x.withInterceptor(new _authenticationInterceptor.AuthenticateInterceptor());
				});
			}
		}]);

		_class = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _authentication.Authentication, _storage.Storage, _baseConfig.BaseConfig)(_class) || _class;
		return _class;
	})();

	module.exports = _default;
});