System.register(['aurelia-dependency-injection', 'aurelia-fetch-client', 'isomorphic-fetch', './authentication'], function (_export) {
    'use strict';

    var inject, HttpClient, Authentication, FetchConfig;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_aureliaDependencyInjection) {
            inject = _aureliaDependencyInjection.inject;
        }, function (_aureliaFetchClient) {
            HttpClient = _aureliaFetchClient.HttpClient;
        }, function (_isomorphicFetch) {}, function (_authentication) {
            Authentication = _authentication.Authentication;
        }],
        execute: function () {
            FetchConfig = (function () {
                function FetchConfig(httpClient, authService) {
                    _classCallCheck(this, _FetchConfig);

                    this.httpClient = httpClient;
                    this.auth = authService;
                }

                _createClass(FetchConfig, [{
                    key: 'configure',
                    value: function configure() {
                        var _this = this;

                        this.httpClient.configure(function (httpConfig) {
                            httpConfig.withDefaults({
                                headers: {
                                    'Accept': 'application/json'
                                }
                            }).withInterceptor(_this.auth.token_interceptor);
                        });
                    }
                }]);

                var _FetchConfig = FetchConfig;
                FetchConfig = inject(HttpClient, Authentication)(FetchConfig) || FetchConfig;
                return FetchConfig;
            })();

            _export('FetchConfig', FetchConfig);
        }
    };
});