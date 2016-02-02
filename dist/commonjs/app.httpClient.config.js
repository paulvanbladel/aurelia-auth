'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaHttpClient = require('aurelia-http-client');

var _baseConfig = require('./baseConfig');

var _authentication = require('./authentication');

var _storage = require('./storage');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _default = (function () {
  function _default(http, auth, storage, config) {
    _classCallCheck(this, _default2);

    this.http = http;
    this.auth = auth;
    this.storage = storage;
    this.config = config.current;
  }

  _createClass(_default, [{
    key: 'configure',
    value: function configure() {
      var _this = this;

      _aureliaHttpClient.RequestBuilder.addHelper('authTokenHandling', function () {
        return function (client, processor, message) {
          if (_this.auth.isAuthenticated() && _this.config.httpInterceptor) {
            var tokenName = (_this.config.tokenPrefix ? _this.config.tokenPrefix + '_' : '') + _this.config.tokenName;
            var token = _this.storage.get(tokenName);

            if (_this.config.authHeader && _this.config.authToken) {
              token = _this.config.authToken + ' ' + token;
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

  var _default2 = _default;
  _default = (0, _aureliaDependencyInjection.inject)(_aureliaHttpClient.HttpClient, _authentication.Authentication, _storage.Storage, _baseConfig.BaseConfig)(_default) || _default;
  return _default;
})();

exports['default'] = _default;
module.exports = exports['default'];