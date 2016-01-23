"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _aureliaFetchClient = require('aurelia-fetch-client');

var _authentication = require('./authentication');

var _baseConfig = require('./baseConfig');

var _aureliaFramework = require('aurelia-framework');

var _storage = require('./storage');

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
var FetchConfig = (function () {
    function FetchConfig(httpClient, auth, storage, config) {
        _classCallCheck(this, FetchConfig);

        this.httpClient = httpClient;
        this.auth = auth;
        this.storage = storage;
        this.config = config.current;
    }

    _createClass(FetchConfig, [{
        key: "configure",
        value: function configure() {
            var auth = this.auth;
            var config = this.config;
            var storage = this.storage;
            this.httpClient.configure(function (httpConfig) {
                httpConfig.withDefaults({
                    headers: {
                        'Accept': 'application/json'
                    }
                }).withInterceptor({
                    request: function request(_request) {
                        if (auth.isAuthenticated() && config.httpInterceptor) {
                            var tokenName = config.tokenPrefix ? config.tokenPrefix + "_" + config.tokenName : config.tokenName;
                            var token = storage.get(tokenName);
                            if (config.authHeader && config.authToken) {
                                token = config.authToken + " " + token;
                            }
                            _request.headers.append(config.authHeader, token);
                        }
                        return _request;
                    }
                });
            });
        }
    }]);

    return FetchConfig;
})();
exports.FetchConfig = FetchConfig;
exports.FetchConfig = FetchConfig = __decorate([(0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication, _storage.Storage, _baseConfig.BaseConfig), __metadata('design:paramtypes', [_aureliaFetchClient.HttpClient, _authentication.Authentication, _storage.Storage, _baseConfig.BaseConfig])], FetchConfig);