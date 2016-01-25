define(["exports", "module", "aurelia-http-client", "./baseConfig", "./authentication", "./storage", "aurelia-framework"], function (exports, module, _aureliaHttpClient, _baseConfig, _authentication, _storage, _aureliaFramework) {
    "use strict";

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

    var default_1 = (function () {
        function default_1(http, auth, storage, config) {
            _classCallCheck(this, default_1);

            this.http = http;
            this.auth = auth;
            this.storage = storage;
            this.config = config.current;
        }

        _createClass(default_1, [{
            key: "configure",
            value: function configure() {
                var _this = this;

                _aureliaHttpClient.RequestBuilder.addHelper('authTokenHandling', function () {
                    return function (client, processor, message) {
                        if (_this.auth.isAuthenticated() && _this.config.httpInterceptor) {
                            var tokenName = (_this.config.tokenPrefix ? _this.config.tokenPrefix + "_" : '') + _this.config.tokenName;
                            var token = _this.storage.get(tokenName);
                            if (_this.config.authHeader && _this.config.authToken) {
                                token = _this.config.authToken + " " + token;
                            }
                            message.headers.add(_this.config.authHeader, token);
                        }
                    };
                });
                this.http.configure(function (x) {
                    x.authTokenHandling();
                    x.withHeader('Accept', 'application/json');
                });
            }
        }]);

        return default_1;
    })();
    default_1 = __decorate([(0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _authentication.Authentication, _storage.Storage, _baseConfig.BaseConfig), __metadata('design:paramtypes', [_aureliaHttpClient.HttpClient, _authentication.Authentication, _storage.Storage, _baseConfig.BaseConfig])], default_1);
    module.exports = default_1;
});