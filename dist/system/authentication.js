System.register(['aurelia-dependency-injection', './baseConfig', './storage', './authUtils'], function (_export) {
    'use strict';

    var inject, BaseConfig, Storage, authUtils, Authentication;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_aureliaDependencyInjection) {
            inject = _aureliaDependencyInjection.inject;
        }, function (_baseConfig) {
            BaseConfig = _baseConfig.BaseConfig;
        }, function (_storage) {
            Storage = _storage.Storage;
        }, function (_authUtils) {
            authUtils = _authUtils['default'];
        }],
        execute: function () {
            Authentication = (function () {
                function Authentication(storage, config) {
                    _classCallCheck(this, _Authentication);

                    this.storage = storage;
                    this.config = config.current;
                    this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
                    this.idTokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
                }

                _createClass(Authentication, [{
                    key: 'getLoginRoute',
                    value: function getLoginRoute() {
                        return this.config.loginRoute;
                    }
                }, {
                    key: 'getLoginRedirect',
                    value: function getLoginRedirect() {
                        return this.initialUrl || this.config.loginRedirect;
                    }
                }, {
                    key: 'getLoginUrl',
                    value: function getLoginUrl() {
                        return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
                    }
                }, {
                    key: 'getSignupUrl',
                    value: function getSignupUrl() {
                        return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
                    }
                }, {
                    key: 'getProfileUrl',
                    value: function getProfileUrl() {
                        return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
                    }
                }, {
                    key: 'getToken',
                    value: function getToken() {
                        return this.storage.get(this.tokenName);
                    }
                }, {
                    key: 'getPayload',
                    value: function getPayload() {

                        var token = this.storage.get(this.tokenName);
                        return this.decomposeToken(token);
                    }
                }, {
                    key: 'decomposeToken',
                    value: function decomposeToken(token) {
                        if (token && token.split('.').length === 3) {
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

                            try {
                                return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
                            } catch (error) {
                                return null;
                            }
                        }
                    }
                }, {
                    key: 'setInitialUrl',
                    value: function setInitialUrl(url) {
                        this.initialUrl = url;
                    }
                }, {
                    key: 'setToken',
                    value: function setToken(response, redirect) {

                        var accessToken = response && response[this.config.responseTokenProp];
                        var tokenToStore = undefined;

                        if (accessToken) {
                            if (authUtils.isObject(accessToken) && authUtils.isObject(accessToken.data)) {
                                response = accessToken;
                            } else if (authUtils.isString(accessToken)) {
                                tokenToStore = accessToken;
                            }
                        }

                        if (!tokenToStore && response) {
                            tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
                        }

                        if (tokenToStore) {
                            this.storage.set(this.tokenName, tokenToStore);
                        }

                        var idToken = response && response[this.config.responseIdTokenProp];

                        if (idToken) {
                            this.storage.set(this.idTokenName, idToken);
                        }

                        if (this.config.loginRedirect && !redirect) {
                            window.location.href = this.getLoginRedirect();
                        } else if (redirect && authUtils.isString(redirect)) {
                            window.location.href = window.encodeURI(redirect);
                        }
                    }
                }, {
                    key: 'removeToken',
                    value: function removeToken() {
                        this.storage.remove(this.tokenName);
                    }
                }, {
                    key: 'isAuthenticated',
                    value: function isAuthenticated() {

                        var token = this.storage.get(this.tokenName);

                        if (!token) {
                            return false;
                        }

                        if (token.split('.').length !== 3) {
                            return true;
                        }

                        var exp = undefined;
                        try {
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                            exp = JSON.parse(window.atob(base64)).exp;
                        } catch (error) {
                            return false;
                        }

                        if (exp) {
                            return Math.round(new Date().getTime() / 1000) <= exp;
                        }

                        return true;
                    }
                }, {
                    key: 'logout',
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
                }, {
                    key: 'token_interceptor',
                    get: function get() {
                        var config = this.config;
                        var storage = this.storage;
                        var auth = this;
                        return {
                            request: function request(_request) {
                                if (auth.isAuthenticated() && config.httpInterceptor) {
                                    var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
                                    var token = storage.get(tokenName);

                                    if (config.authHeader && config.authToken) {
                                        token = config.authToken + ' ' + token;
                                    }

                                    _request.headers.append(config.authHeader, token);
                                }
                                return _request;
                            }
                        };
                    }
                }]);

                var _Authentication = Authentication;
                Authentication = inject(Storage, BaseConfig)(Authentication) || Authentication;
                return Authentication;
            })();

            _export('Authentication', Authentication);
        }
    };
});