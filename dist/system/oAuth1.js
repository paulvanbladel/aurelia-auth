System.register(["aurelia-framework", "./authUtils", "./storage", "./popup", "./baseConfig", "aurelia-fetch-client"], function (_export) {
    "use strict";

    var inject, authUtils, Storage, Popup, BaseConfig, HttpClient, json, __decorate, __metadata, OAuth1;

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
        }, function (_authUtils) {
            authUtils = _authUtils["default"];
        }, function (_storage) {
            Storage = _storage.Storage;
        }, function (_popup) {
            Popup = _popup.Popup;
        }, function (_baseConfig) {
            BaseConfig = _baseConfig.BaseConfig;
        }, function (_aureliaFetchClient) {
            HttpClient = _aureliaFetchClient.HttpClient;
            json = _aureliaFetchClient.json;
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

            OAuth1 = (function () {
                function OAuth1(storage, popup, http, config) {
                    _classCallCheck(this, OAuth1);

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
                        popupOptions: null,
                        redirectUri: null,
                        authorizationEndpoint: null
                    };
                }

                _createClass(OAuth1, [{
                    key: "open",
                    value: function open(options, userData) {
                        authUtils.extend(this.defaults, options);
                        var serverUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.defaults.url) : this.defaults.url;
                        if (this.config.platform !== 'mobile') {
                            this.popup = this.popup.open('', this.defaults.name, this.defaults.popupOptions, this.defaults.redirectUri);
                        }
                        var self = this;
                        return this.http.fetch(serverUrl, {
                            method: 'post'
                        }).then(status).then(toJson).then(function (response) {
                            if (self.config.platform === 'mobile') {
                                self.popup = self.popup.open([self.defaults.authorizationEndpoint, self.buildQueryString(response.content)].join('?'), self.defaults.name, self.defaults.popupOptions, self.defaults.redirectUri);
                            } else {
                                self.popup.popupWindow.location = [self.defaults.authorizationEndpoint, self.buildQueryString(response.content)].join('?');
                            }
                            var popupListener = self.config.platform === 'mobile' ? self.popup.eventListener(self.defaults.redirectUri) : self.popup.pollPopup();
                            return popupListener.then(function (response) {
                                return self.exchangeForToken(response, userData);
                            });
                        });
                    }
                }, {
                    key: "exchangeForToken",
                    value: function exchangeForToken(oauthData, userData) {
                        var data = authUtils.extend({}, userData, oauthData);
                        var exchangeForTokenUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.defaults.url) : this.defaults.url;
                        return this.http.fetch(exchangeForTokenUrl, {
                            method: 'post',
                            body: json(data),
                            credentials: this.config.withCredentials
                        }).then(status).then(toJson).then(function (response) {
                            return response;
                        });
                    }
                }, {
                    key: "buildQueryString",
                    value: function buildQueryString(obj) {
                        var str = [];
                        authUtils.forEach(obj, function (value, key) {
                            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                        });
                        return str.join('&');
                    }
                }]);

                return OAuth1;
            })();

            _export("OAuth1", OAuth1);

            _export("OAuth1", OAuth1 = __decorate([inject(Storage, Popup, HttpClient, BaseConfig), __metadata('design:paramtypes', [Storage, Popup, HttpClient, BaseConfig])], OAuth1));
        }
    };
});