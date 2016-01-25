System.register(["aurelia-framework", "aurelia-fetch-client", "./authentication", "./baseConfig", "./oAuth1", "./oAuth2", "./authUtils"], function (_export) {
    "use strict";

    var inject, HttpClient, json, Authentication, BaseConfig, OAuth1, OAuth2, authUtils, __decorate, __metadata, AuthService;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    return {
        setters: [function (_aureliaFramework) {
            inject = _aureliaFramework.inject;
        }, function (_aureliaFetchClient) {
            HttpClient = _aureliaFetchClient.HttpClient;
            json = _aureliaFetchClient.json;
        }, function (_authentication) {
            Authentication = _authentication.Authentication;
        }, function (_baseConfig) {
            BaseConfig = _baseConfig.BaseConfig;
        }, function (_oAuth1) {
            OAuth1 = _oAuth1.OAuth1;
        }, function (_oAuth2) {
            OAuth2 = _oAuth2.OAuth2;
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

            AuthService = (function () {
                function AuthService(http, auth, oAuth1, oAuth2, config) {
                    _classCallCheck(this, AuthService);

                    this.http = http;
                    this.auth = auth;
                    this.oAuth1 = oAuth1;
                    this.oAuth2 = oAuth2;
                    this.config = config.current;
                }

                _createClass(AuthService, [{
                    key: "getMe",
                    value: function getMe() {
                        var profileUrl = this.auth.getProfileUrl();
                        return this.http.fetch(profileUrl).then(status).then(toJson).then(function (response) {
                            return response;
                        });
                    }
                }, {
                    key: "isAuthenticated",
                    value: function isAuthenticated() {
                        return this.auth.isAuthenticated();
                    }
                }, {
                    key: "getTokenPayload",
                    value: function getTokenPayload() {
                        return this.auth.getPayload();
                    }
                }, {
                    key: "signup",
                    value: function signup(displayName, email, password) {
                        var _this = this;

                        var signupUrl = this.auth.getSignupUrl();
                        var content;
                        if (typeof arguments[0] === 'object') {
                            content = arguments[0];
                        } else {
                            content = {
                                'displayName': displayName,
                                'email': email,
                                'password': password
                            };
                        }
                        return this.http.fetch(signupUrl, {
                            method: 'post',
                            body: json(content)
                        }).then(status).then(toJson).then(function (response) {
                            if (_this.config.loginOnSignup) {
                                _this.auth.setToken(response);
                            } else if (_this.config.signupRedirect) {
                                window.location.href = _this.config.signupRedirect;
                            }
                            return response;
                        });
                    }
                }, {
                    key: "login",
                    value: function login(email, password) {
                        var _this2 = this;

                        var loginUrl = this.auth.getLoginUrl();
                        var content;
                        if (typeof arguments[1] !== 'string') {
                            content = arguments[0];
                        } else {
                            content = { 'email': email, 'password': password };
                        }
                        if (this.config.postContentType === 'json') {
                            content = JSON.stringify(content);
                        } else if (this.config.postContentType === 'form') {
                            var data = [];
                            for (var key in content) {
                                data.push(key + "=" + content[key]);
                            }
                            content = data.join('&');
                        }
                        return this.http.fetch(loginUrl, {
                            method: 'post',
                            body: content
                        }).then(status).then(toJson).then(function (response) {
                            if (_this2.config.useRefreshToken) {
                                _this2.auth.setRefreshToken(response);
                            }
                            _this2.auth.setToken(response);
                            return response;
                        });
                    }
                }, {
                    key: "logout",
                    value: function logout(redirectUri) {
                        return this.auth.logout(redirectUri);
                    }
                }, {
                    key: "authenticate",
                    value: function authenticate(name, redirect, userData) {
                        var _this3 = this;

                        var provider = this.oAuth2;
                        if (this.config.providers[name].type === '1.0') {
                            provider = this.oAuth1;
                        }
                        ;
                        return provider.open(this.config.providers[name], userData || {}).then(function (response) {
                            _this3.auth.setToken(response, redirect);
                            return response;
                        });
                    }
                }, {
                    key: "unlink",
                    value: function unlink(provider) {
                        var unlinkUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;
                        if (this.config.unlinkMethod === 'get') {
                            return this.http.fetch(unlinkUrl + provider).then(status).then(toJson).then(function (response) {
                                return response;
                            });
                        } else if (this.config.unlinkMethod === 'post') {
                            return this.http.fetch(unlinkUrl, {
                                method: 'post',
                                body: json(provider)
                            }).then(status).then(toJson).then(function (response) {
                                return response;
                            });
                        }
                    }
                }]);

                return AuthService;
            })();

            _export("AuthService", AuthService);

            _export("AuthService", AuthService = __decorate([inject(HttpClient, Authentication, OAuth1, OAuth2, BaseConfig), __metadata('design:paramtypes', [HttpClient, Authentication, OAuth1, OAuth2, BaseConfig])], AuthService));
        }
    };
});