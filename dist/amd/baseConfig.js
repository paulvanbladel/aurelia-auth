define(['exports', './authUtils'], function (exports, _authUtils) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _authUtils2 = _interopRequireDefault(_authUtils);

    var BaseConfig = (function () {
        function BaseConfig() {
            _classCallCheck(this, BaseConfig);

            this._current = {
                httpInterceptor: true,
                loginOnSignup: true,
                baseUrl: '/',
                loginRedirect: '/#customer',
                logoutRedirect: '/',
                signupRedirect: '/login',
                loginUrl: '/auth/login',
                signupUrl: '/auth/signup',
                profileUrl: '/auth/me',
                loginRoute: '/login',
                signupRoute: '/signup',
                postContentType: 'json',
                useRefreshToken: false,
                refreshTokenRoot: false,
                refreshTokenName: 'refresh_token',
                refreshTokenPrefix: 'aurelia',
                tokenRoot: false,
                tokenName: 'token',
                tokenPrefix: 'aurelia',
                unlinkUrl: '/auth/unlink/',
                unlinkMethod: 'get',
                authHeader: 'Authorization',
                authToken: 'Bearer',
                withCredentials: true,
                platform: 'browser',
                storage: 'localStorage',
                providers: {
                    google: {
                        name: 'google',
                        url: '/auth/google',
                        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        scope: ['profile', 'email'],
                        scopePrefix: 'openid',
                        scopeDelimiter: ' ',
                        requiredUrlParams: ['scope'],
                        optionalUrlParams: ['display'],
                        display: 'popup',
                        type: '2.0',
                        popupOptions: {
                            width: 452,
                            height: 633
                        }
                    },
                    facebook: {
                        name: 'facebook',
                        url: '/auth/facebook',
                        authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
                        redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
                        scope: ['email'],
                        scopeDelimiter: ',',
                        nonce: function nonce() {
                            return Math.random();
                        },
                        requiredUrlParams: ['nonce', 'display', 'scope'],
                        display: 'popup',
                        type: '2.0',
                        popupOptions: {
                            width: 580,
                            height: 400
                        }
                    },
                    linkedin: {
                        name: 'linkedin',
                        url: '/auth/linkedin',
                        authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        requiredUrlParams: ['state'],
                        scope: ['r_emailaddress'],
                        scopeDelimiter: ' ',
                        state: 'STATE',
                        type: '2.0',
                        popupOptions: {
                            width: 527,
                            height: 582
                        }
                    },
                    github: {
                        name: 'github',
                        url: '/auth/github',
                        authorizationEndpoint: 'https://github.com/login/oauth/authorize',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        optionalUrlParams: ['scope'],
                        scope: ['user:email'],
                        scopeDelimiter: ' ',
                        type: '2.0',
                        popupOptions: {
                            width: 1020,
                            height: 618
                        }
                    },
                    yahoo: {
                        name: 'yahoo',
                        url: '/auth/yahoo',
                        authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        scope: [],
                        scopeDelimiter: ',',
                        type: '2.0',
                        popupOptions: {
                            width: 559,
                            height: 519
                        }
                    },
                    twitter: {
                        name: 'twitter',
                        url: '/auth/twitter',
                        authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
                        type: '1.0',
                        popupOptions: {
                            width: 495,
                            height: 645
                        }
                    },
                    live: {
                        name: 'live',
                        url: '/auth/live',
                        authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        scope: ['wl.emails'],
                        scopeDelimiter: ' ',
                        requiredUrlParams: ['display', 'scope'],
                        display: 'popup',
                        type: '2.0',
                        popupOptions: {
                            width: 500,
                            height: 560
                        }
                    },
                    instagram: {
                        name: 'instagram',
                        url: '/auth/instagram',
                        authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
                        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                        requiredUrlParams: ['scope'],
                        scope: ['basic'],
                        scopeDelimiter: '+',
                        display: 'popup',
                        type: '2.0',
                        popupOptions: {
                            width: 550,
                            height: 369
                        }
                    }
                }
            };
        }

        _createClass(BaseConfig, [{
            key: 'configure',
            value: function configure(incomingConfig) {
                _authUtils2['default'].merge(this._current, incomingConfig);
            }
        }, {
            key: 'current',
            get: function get() {
                return this._current;
            }
        }]);

        return BaseConfig;
    })();

    exports.BaseConfig = BaseConfig;
});