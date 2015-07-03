'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaFramework = require('aurelia-framework');

var _authUtils = require('./authUtils');

var _authUtils2 = _interopRequireDefault(_authUtils);

var _storage = require('./storage');

var _popup = require('./popup');

var _baseConfig = require('./baseConfig');

var _aureliaHttpClient = require('aurelia-http-client');

var OAuth1 = (function () {
	function OAuth1(storage, popup, http, config) {
		_classCallCheck(this, _OAuth1);

		this.storage = storage;
		this.config = config.current;
		this.popup = popup;
		this.http = http;
		this.defaults = {
			url: null,
			name: null,
			popupOptions: null,
			redirectUri: null,
			authorizationEndpoint: null
		};
	}

	var _OAuth1 = OAuth1;

	_createClass(_OAuth1, [{
		key: 'open',
		value: function open(options, userData) {
			_authUtils2['default'].extend(this.defaults, options);

			var serverUrl = this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, this.defaults.url) : this.defaults.url;

			if (this.config.platform !== 'mobile') {
				this.popup = this.popup.open('', this.defaults.name, this.defaults.popupOptions, this.defaults.redirectUri);
			}
			var self = this;
			return this.http.createRequest(serverUrl).asPost().send().then(function (response) {
				if (self.config.platform === 'mobile') {
					self.popup = self.popup.open([self.defaults.authorizationEndpoint, self.buildQueryString(response.content)].join('?'), self.defaults.name, self.defaults.popupOptions, self.defaults.redirectUri);
				} else {
					self.popup.popupWindow.location = [self.defaults.authorizationEndpoint, self.buildQueryString(response.content)].join('?');
				}

				var popupListener = self.config.platform === 'mobile' ? self.popup.eventListener(self.defaults.redirectUri) : self.popup.pollPopup();

				return popupListener.then(function (response) {
					return self.exchangeForToken(response, userData);
				});
			});
		}
	}, {
		key: 'exchangeForToken',
		value: function exchangeForToken(oauthData, userData) {
			var data = _authUtils2['default'].extend({}, userData, oauthData);
			var exchangeForTokenUrl = this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, this.defaults.url) : this.defaults.url;
			return this.http.createRequest(exchangeForTokenUrl).asPost().withCredentials(this.config.withCredentials).withContent(data).send().then(function (response) {
				return response;
			})['catch'](function (err) {
				console.log('error :' + err.content.message);
				throw err;
			});
		}
	}, {
		key: 'buildQueryString',
		value: function buildQueryString(obj) {
			var str = [];

			_authUtils2['default'].forEach(obj, function (value, key) {
				str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
			});

			return str.join('&');
		}
	}]);

	OAuth1 = (0, _aureliaFramework.inject)(_storage.Storage, _popup.Popup, _aureliaHttpClient.HttpClient, _baseConfig.BaseConfig)(OAuth1) || OAuth1;
	return OAuth1;
})();

exports.OAuth1 = OAuth1;