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

                        var tokenName = this.tokenName;
                        var accessToken = response && response[this.config.responseTokenProp];
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

                            throw new Error('Expecting a token named "' + tokenPath + '" but instead got: ' + JSON.stringify(response));
                        }

                        this.storage.set(tokenName, token);

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
                }]);

                var _Authentication = Authentication;
                Authentication = inject(Storage, BaseConfig)(Authentication) || Authentication;
                return Authentication;
            })();

            _export('Authentication', Authentication);
        }
    };
});