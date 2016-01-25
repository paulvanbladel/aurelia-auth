"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _aureliaFramework = require('aurelia-framework');

var _authUtils = require('./authUtils');

var _authUtils2 = _interopRequireDefault(_authUtils);

var _storage = require('./storage');

var _popup = require('./popup');

var _baseConfig = require('./baseConfig');

var _aureliaFetchClient = require('aurelia-fetch-client');

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OAuth2 = (function () {
    function OAuth2(storage, popup, http, config) {
        _classCallCheck(this, OAuth2);

        this.storage = storage;
        this.popup = popup;
        this.http = http;
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

    _createClass(OAuth2, [{
        key: "open",
        value: function open(options, userData) {
            _authUtils2["default"].extend(this.defaults, options);
            var stateName = this.defaults.name + '_state';
            if (_authUtils2["default"].isFunction(this.defaults.state)) {
                this.storage.set(stateName, this.defaults.state());
            } else if (_authUtils2["default"].isString(this.defaults.state)) {
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
                if (self.defaults.responseType === 'token' || self.defaults.responseType === 'id_token%20token' || self.defaults.responseType === 'token%20id_token') {
                    return oauthData;
                }
                if (oauthData.state && oauthData.state !== self.storage.get(stateName)) {
                    return Promise.reject('OAuth 2.0 state parameter mismatch.');
                }
                return self.exchangeForToken(oauthData, userData);
            });
        }
    }, {
        key: "exchangeForToken",
        value: function exchangeForToken(oauthData, userData) {
            var data = _authUtils2["default"].extend({}, userData, {
                code: oauthData.code,
                clientId: this.defaults.clientId,
                redirectUri: this.defaults.redirectUri
            });
            if (oauthData.state) {
                data.state = oauthData.state;
            }
            _authUtils2["default"].forEach(this.defaults.responseParams, function (param) {
                data[param] = oauthData[param];
            });
            var exchangeForTokenUrl = this.config.baseUrl ? _authUtils2["default"].joinUrl(this.config.baseUrl, this.defaults.url) : this.defaults.url;
            return this.http.fetch(exchangeForTokenUrl, {
                method: 'post',
                body: (0, _aureliaFetchClient.json)(data),
                credentials: this.config.withCredentials
            }).then(status).then(toJson).then(function (response) {
                return response;
            });
        }
    }, {
        key: "buildQueryString",
        value: function buildQueryString() {
            var _this = this;

            var keyValuePairs = [];
            var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];
            _authUtils2["default"].forEach(urlParams, function (params) {
                _authUtils2["default"].forEach(_this.defaults[params], function (paramName) {
                    var camelizedName = _authUtils2["default"].camelCase(paramName);
                    var paramValue = _authUtils2["default"].isFunction(_this.defaults[paramName]) ? _this.defaults[paramName]() : _this.defaults[camelizedName];
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

    return OAuth2;
})();
exports.OAuth2 = OAuth2;
exports.OAuth2 = OAuth2 = __decorate([(0, _aureliaFramework.inject)(_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig), __metadata('design:paramtypes', [_storage.Storage, _popup.Popup, _aureliaFetchClient.HttpClient, _baseConfig.BaseConfig])], OAuth2);
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
function toJson(response) {
    return response.json();
}