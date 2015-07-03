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

var OAuth2 = (function () {
    function OAuth2(storage, popup, http, config) {
        _classCallCheck(this, _OAuth2);

        this.storage = storage;
        this.config = config.current;
        this.popup = popup;
        this.http = http;
        this.defaults = {
            url: null,
            name: null,
            state: null,
            scope: null,
            scopeDelimiter: null,
            redirectUri: null,
            popupOptions: null,
            authorizationEndpoint: null,
            responseParams: null,
            requiredUrlParams: null,
            optionalUrlParams: null,
            defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
            responseType: 'code'
        };
    }

    var _OAuth2 = OAuth2;

    _createClass(_OAuth2, [{
        key: 'open',
        value: function open(options, userData) {
            _authUtils2['default'].extend(this.defaults, options);
            var stateName = this.defaults.name + '_state';

            if (_authUtils2['default'].isFunction(this.defaults.state)) {
                this.storage.set(stateName, this.defaults.state());
            } else if (_authUtils2['default'].isString(this.defaults.state)) {
                this.storage.set(stateName, this.defaults.state);
            }

            var url = this.defaults.authorizationEndpoint + '?' + this.buildQueryString();

            var openPopup;
            if (this.config.platform === 'mobile') {
                openPopup = this.popup.open(url, this.defaults.name, this.defaults.popupOptions, this.defaults.redirectUri).eventListener(this.defaults.redirectUri);
            } else {
                openPopup = this.popup.open(url, this.defaults.name, this.defaults.popupOptions, this.defaults.redirectUri).pollPopup();
            }

            var self = this;
            return openPopup.then(function (oauthData) {
                if (self.defaults.responseType === 'token') {
                    return oauthData;
                }
                if (oauthData.state && oauthData.state !== self.storage.get(stateName)) {
                    return Promise.reject('OAuth 2.0 state parameter mismatch.');
                }
                return self.exchangeForToken(oauthData, userData);
            });
        }
    }, {
        key: 'exchangeForToken',
        value: function exchangeForToken(oauthData, userData) {
            var data = _authUtils2['default'].extend({}, userData, {
                code: oauthData.code,
                clientId: this.defaults.clientId,
                redirectUri: this.defaults.redirectUri
            });

            if (oauthData.state) {
                data.state = oauthData.state;
            }

            _authUtils2['default'].forEach(this.defaults.responseParams, function (param) {
                data[param] = oauthData[param];
            });

            var exchangeForTokenUrl = this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, this.defaults.url) : this.defaults.url;

            return this.http.createRequest(exchangeForTokenUrl).asPost().withContent(data).withCredentials(this.config.withCredentials).send().then(function (response) {
                return response;
            })['catch'](function (err) {
                console.log('error :' + err.content.message);
                throw err;
            });
        }
    }, {
        key: 'buildQueryString',
        value: function buildQueryString() {
            var _this = this;

            var keyValuePairs = [];
            var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];
            _authUtils2['default'].forEach(urlParams, function (params) {

                _authUtils2['default'].forEach(_this.defaults[params], function (paramName) {
                    var camelizedName = _authUtils2['default'].camelCase(paramName);
                    var paramValue = _authUtils2['default'].isFunction(_this.defaults[paramName]) ? _this.defaults[paramName]() : _this.defaults[camelizedName];

                    if (paramName === 'state') {
                        var stateName = _this.defaults.name + '_state';
                        paramValue = encodeURIComponent(_this.storage.get(stateName));
                    }

                    if (paramName === 'scope' && Array.isArray(paramValue)) {
                        paramValue = paramValue.join(_this.defaults.scopeDelimiter);

                        if (_this.defaults.scopePrefix) {
                            paramValue = [_this.defaults.scopePrefix, paramValue].join(_this.defaults.scopeDelimiter);
                        }
                    }

                    keyValuePairs.push([paramName, paramValue]);
                });
            });

            return keyValuePairs.map(function (pair) {
                return pair.join('=');
            }).join('&');
        }
    }]);

    OAuth2 = (0, _aureliaFramework.inject)(_storage.Storage, _popup.Popup, _aureliaHttpClient.HttpClient, _baseConfig.BaseConfig)(OAuth2) || OAuth2;
    return OAuth2;
})();

exports.OAuth2 = OAuth2;