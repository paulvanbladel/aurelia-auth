define(['exports', 'aurelia-dependency-injection', './baseConfig', './storage', './authUtils'], function (exports, _aureliaDependencyInjection, _baseConfig, _storage, _authUtils) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _authUtils2 = _interopRequireDefault(_authUtils);

    var Authentication = (function () {
        function Authentication(storage, config) {
            _classCallCheck(this, _Authentication);

            this.storage = storage;
            this.config = config.current;
            this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
            this.idTokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
            this.token = storage.get(this.tokenName);
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
            key: 'getRequiredRoles',
            value: function getRequiredRoles() {
                return this.requiredRoles || [];
            }
        }, {
            key: 'getLoginUrl',
            value: function getLoginUrl() {
                return this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
            }
        }, {
            key: 'getSignupUrl',
            value: function getSignupUrl() {
                return this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
            }
        }, {
            key: 'getProfileUrl',
            value: function getProfileUrl() {
                return this.config.baseUrl ? _authUtils2['default'].joinUrl(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
            }
        }, {
            key: 'getToken',
            value: function getToken() {
                return this.token;
            }
        }, {
            key: 'getPayload',
            value: function getPayload() {
                if (this.token && this.token.split('.').length === 3) {
                    var base64Url = this.token.split('.')[1];
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
            value: function setInitialUrl(url, roles) {
                this.initialUrl = url;
                this.requiredRoles = roles;
            }
        }, {
            key: 'setToken',
            value: function setToken(response, redirect) {

                var accessToken = response && response[this.config.responseTokenProp];
                var tokenToStore = undefined;

                if (accessToken) {
                    if (_authUtils2['default'].isObject(accessToken) && _authUtils2['default'].isObject(accessToken.data)) {
                        response = accessToken;
                    } else if (_authUtils2['default'].isString(accessToken)) {
                        tokenToStore = accessToken;
                    }
                }

                if (!tokenToStore && response) {
                    tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
                }

                if (tokenToStore) {
                    this.token = tokenToStore;
                    this.storage.set(this.tokenName, tokenToStore);
                }

                var idToken = response && response[this.config.responseIdTokenProp];
                var idTokenToStore = undefined;

                if (idToken) {
                    if (_authUtils2['default'].isObject(idToken) && _authUtils2['default'].isObject(idToken.data)) {
                        response = idToken;
                    } else if (_authUtils2['default'].isString(idToken)) {
                        idTokenToStore = idToken;
                    }
                }

                if (!idTokenToStore && response) {
                    idTokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.idTokenName] : response[this.config.IdTokenName];
                }

                if (idTokenToStore) {
                    this.storage.set(this.idTokenName, idTokenToStore);
                }

                if (this.config.loginRedirect && !redirect) {
                    window.location.href = this.getLoginRedirect();
                } else if (redirect && _authUtils2['default'].isString(redirect)) {
                    window.location.href = window.encodeURI(redirect);
                }
            }
        }, {
            key: 'removeToken',
            value: function removeToken() {
                this.token = undefined;
                this.storage.remove(this.tokenName);
            }
        }, {
            key: 'isAuthenticated',
            value: function isAuthenticated(auth) {
                if (!this.token) {
                    return false;
                }

                if (this.token.split('.').length !== 3) {
                    return _authUtils2['default'].isArray(auth) ? auth.length === 0 : true;
                }
                var payload = this.getPayload();
                if (!payload) {
                    return false;
                }
                if (payload.exp && Math.round(new Date().getTime() / 1000) > payload.exp) {
                    return false;
                }
                if (_authUtils2['default'].isArray(auth) && auth.length > 0) {
                    if (!payload.sub.roles) {
                        return false;
                    }
                    return auth.some(function (r) {
                        return payload.sub.roles.some(function (rp) {
                            return r === rp;
                        });
                    });
                }
                return true;
            }
        }, {
            key: 'isAuthorised',
            value: function isAuthorised(auth) {
                if (!auth || _authUtils2['default'].isArray(auth) && auth.length === 0) {
                    return true;
                }
                return this.isAuthenticated(auth);
            }
        }, {
            key: 'logout',
            value: function logout(redirect) {
                var _this = this;

                return new Promise(function (resolve) {
                    _this.removeToken();
                    if (_this.config.logoutRedirect && !redirect) {
                        window.location.href = _this.config.logoutRedirect;
                    } else if (_authUtils2['default'].isString(redirect)) {
                        window.location.href = redirect;
                    }

                    resolve();
                });
            }
        }]);

        var _Authentication = Authentication;
        Authentication = (0, _aureliaDependencyInjection.inject)(_storage.Storage, _baseConfig.BaseConfig)(Authentication) || Authentication;
        return Authentication;
    })();

    exports.Authentication = Authentication;
});