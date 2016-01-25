System.register(["aurelia-framework", "./baseConfig", "./storage", "./authUtils"], function (_export) {
    "use strict";

    var inject, BaseConfig, Storage, authUtils, __decorate, __metadata, Authentication;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [function (_aureliaFramework) {
            inject = _aureliaFramework.inject;
        }, function (_baseConfig) {
            BaseConfig = _baseConfig.BaseConfig;
        }, function (_storage) {
            Storage = _storage.Storage;
        }, function (_authUtils) {
            authUtils = _authUtils["default"];
        }],
        execute: function () {
            __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
                var c = arguments.length,
                    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
                    d;
                if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            };

            __metadata = undefined && undefined.__metadata || function (k, v) {
                if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
            };

            Authentication = (function () {
                function Authentication(storage, config) {
                    _classCallCheck(this, Authentication);

                    this.storage = storage;
                    this.config = config.current;
                    this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
                    this.refreshTokenName = this.config.refreshTokenPrefix ? this.config.refreshTokenPrefix + '_' + this.config.refreshTokenName : this.config.refreshTokenName;
                }

                _createClass(Authentication, [{
                    key: "getLoginRoute",
                    value: function getLoginRoute() {
                        return this.config.loginRoute;
                    }
                }, {
                    key: "getLoginRedirect",
                    value: function getLoginRedirect() {
                        return this.config.loginRedirect;
                    }
                }, {
                    key: "getLoginUrl",
                    value: function getLoginUrl() {
                        return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
                    }
                }, {
                    key: "getSignupUrl",
                    value: function getSignupUrl() {
                        return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
                    }
                }, {
                    key: "getProfileUrl",
                    value: function getProfileUrl() {
                        return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
                    }
                }, {
                    key: "getToken",
                    value: function getToken() {
                        return this.storage.get(this.tokenName);
                    }
                }, {
                    key: "getRefreshToken",
                    value: function getRefreshToken() {
                        return this.storage.get(this.refreshTokenName);
                    }
                }, {
                    key: "getPayload",
                    value: function getPayload() {
                        var token = this.storage.get(this.tokenName);
                        if (token && token.split('.').length === 3) {
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                            return JSON.parse(decodeURIComponent(encodeURI(window.atob(base64))));
                        }
                    }
                }, {
                    key: "setToken",
                    value: function setToken(response, redirect) {
                        var tokenName = this.tokenName;
                        var accessToken = response && response.access_token;
                        var token;
                        if (accessToken) {
                            if (authUtils.isObject(accessToken) && authUtils.isObject(accessToken.data)) {
                                response = accessToken;
                            } else if (authUtils.isString(accessToken)) {
                                token = accessToken;
                            }
                        }
                        if (!token && response) {
                            token = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
                        }
                        if (!token) {
                            var tokenPath = this.config.tokenRoot ? this.config.tokenRoot + '.' + this.config.tokenName : this.config.tokenName;
                            throw new Error('Expecting a token named "' + tokenPath + '" but instead got: ' + JSON.stringify(response.content));
                        }
                        this.storage.set(tokenName, token);
                        if (this.config.loginRedirect && !redirect) {
                            window.location.href = this.config.loginRedirect;
                        } else if (redirect && authUtils.isString(redirect)) {
                            window.location.href = encodeURI(redirect);
                        }
                    }
                }, {
                    key: "setRefreshToken",
                    value: function setRefreshToken(response) {
                        var refreshTokenName = this.refreshTokenName;
                        var refreshToken = response && response.refresh_token;
                        var token;
                        if (refreshToken) {
                            if (authUtils.isObject(refreshToken) && authUtils.isObject(refreshToken.data)) {
                                response = refreshToken;
                            } else if (authUtils.isString(refreshToken)) {
                                token = refreshToken;
                            }
                        }
                        if (!token && response) {
                            token = this.config.refreshTokenRoot && response[this.config.refreshTokenRoot] ? response[this.config.refreshTokenRoot][this.config.refreshTokenName] : response[this.config.refreshTokenName];
                        }
                        if (!token) {
                            var refreshTokenPath = this.config.refreshTokenRoot ? this.config.refreshTokenRoot + '.' + this.config.refreshTokenName : this.config.refreshTokenName;
                            throw new Error('Expecting a refresh token named "' + refreshTokenPath + '" but instead got: ' + JSON.stringify(response.content));
                        }
                        this.storage.set(refreshTokenName, token);
                    }
                }, {
                    key: "removeToken",
                    value: function removeToken() {
                        this.storage.remove(this.tokenName);
                    }
                }, {
                    key: "isAuthenticated",
                    value: function isAuthenticated() {
                        var token = this.storage.get(this.tokenName);
                        if (!token) {
                            return false;
                        }
                        if (token.split('.').length !== 3) {
                            return true;
                        }
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        var exp = JSON.parse(window.atob(base64)).exp;
                        if (exp) {
                            return Math.round(new Date().getTime() / 1000) <= exp;
                        }
                        return true;
                    }
                }, {
                    key: "logout",
                    value: function logout(redirect) {
                        var _this = this;

                        return new Promise(function (resolve) {
                            _this.storage.remove(_this.tokenName);
                            if (_this.config.logoutRedirect && !redirect) {
                                window.location.href = _this.config.logoutRedirect;
                            } else if (authUtils.isString(redirect)) {
                                window.location.href = redirect;
                            }
                            resolve();
                        });
                    }
                }]);

                return Authentication;
            })();

            _export("Authentication", Authentication);

            _export("Authentication", Authentication = __decorate([inject(Storage, BaseConfig), __metadata('design:paramtypes', [Storage, BaseConfig])], Authentication));
        }
    };
});