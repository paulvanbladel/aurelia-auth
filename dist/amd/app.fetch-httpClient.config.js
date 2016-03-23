define(['exports', 'aurelia-dependency-injection', 'aurelia-fetch-client', 'isomorphic-fetch', './authentication'], function (exports, _aureliaDependencyInjection, _aureliaFetchClient, _isomorphicFetch, _authentication) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var FetchConfig = (function () {
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
        FetchConfig = (0, _aureliaDependencyInjection.inject)(_aureliaFetchClient.HttpClient, _authentication.Authentication)(FetchConfig) || FetchConfig;
        return FetchConfig;
    })();

    exports.FetchConfig = FetchConfig;
});