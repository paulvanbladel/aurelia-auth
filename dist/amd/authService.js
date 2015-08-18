define(['exports', 'aurelia-framework', 'aurelia-http-client', './authentication', './baseConfig', './oAuth1', './oAuth2', './authUtils'], function (exports, _aureliaFramework, _aureliaHttpClient, _authentication, _baseConfig, _oAuth1, _oAuth2, _authUtils) {
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _authUtils2 = _interopRequireDefault(_authUtils);

	var AuthService = (function () {
		function AuthService(http, auth, oAuth1, oAuth2, config) {
			_classCallCheck(this, _AuthService);

			this.http = http;
			this.auth = auth;
			this.oAuth1 = oAuth1;
			this.oAuth2 = oAuth2;
			this.config = config.current;
		}

		_createClass(AuthService, [{
			key: 'getMe',
			value: function getMe() {
				var profileUrl = this.auth.getProfileUrl();
				return this.http.createRequest(profileUrl).asGet().send().then(function (response) {
					return response.content;
				});
			}
		}, {
			key: 'isAuthenticated',
			value: function isAuthenticated() {
				return this.auth.isAuthenticated();
			}
		}, {
			key: 'signup',
			value: function signup(displayName, email, password) {
				var _this = this;

				var signupUrl = this.auth.getSignupUrl();
				var content;
				if (typeof arguments[0] === 'object') {
					content = arguments[0];
				} else {
					content = { 'displayName': displayName, 'email': email, 'password': password };
				}
				return this.http.createRequest(signupUrl).asPost().withContent(content).send().then(function (response) {
					if (_this.config.loginOnSignup) {
						_this.auth.setToken(response);
					} else if (_this.config.signupRedirect) {
						window.location.href = _this.config.signupRedirect;
					}
					return response;
				});
			}
		}, {
			key: 'login',
			value: function login(email, password) {
				var _this2 = this;

				var loginUrl = this.auth.getLoginUrl();
				var content;
				if (typeof arguments[0] === 'object') {
					content = arguments[0];
				} else {
					content = { 'email': email, 'password': password };
				}

				return this.http.createRequest(loginUrl).asPost().withContent(content).send().then(function (response) {
					_this2.auth.setToken(response);
					console.log("authservice login ok ");
					return response;
				})['catch'](function (err) {
					console.log("error :" + err.content.message);
					throw err;
				});
			}
		}, {
			key: 'logout',
			value: function logout(redirectUri) {
				var _this3 = this;

				console.log("log out service");
				return new Promise(function (resolve, reject) {
					_this3.auth.logout(redirectUri).then(function (response) {})['catch'](function (err) {});
				});
			}
		}, {
			key: 'authenticate',
			value: function authenticate(name, redirect, userData) {
				var _this4 = this;

				var provider = this.oAuth2;
				if (this.config.providers[name].type === '1.0') {
					provider = this.oAuth1;
				};

				return provider.open(this.config.providers[name], userData || {}).then(function (response) {
					_this4.auth.setToken(response, redirect);
					return response;
				})['catch'](function (error) {
					console.log("auth problem");
					throw error;
				});
			}
		}, {
			key: 'unlink',
			value: function unlink(provider) {
				var unlinkUrl = this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

				if (this.config.unlinkMethod === 'get') {
					return this.http.createRequest(unlinkUrl + provider).asGet().send().then(function (response) {
						return response;
					});
				} else if (this.config.unlinkMethod === 'post') {
					return this.http.createRequest(unlinkUrl).asPost().withContent(provider).send().then(function (response) {
						return response;
					});
				}
			}
		}]);

		var _AuthService = AuthService;
		AuthService = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _authentication.Authentication, _oAuth1.OAuth1, _oAuth2.OAuth2, _baseConfig.BaseConfig)(AuthService) || AuthService;
		return AuthService;
	})();

	exports.AuthService = AuthService;
});