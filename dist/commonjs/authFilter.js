'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaFramework = require('aurelia-framework');

var _authentication = require('./authentication');

var AuthFilterValueConverter = (function () {
  function AuthFilterValueConverter(auth) {
    _classCallCheck(this, _AuthFilterValueConverter);

    this.auth = auth;
  }

  _createClass(AuthFilterValueConverter, [{
    key: 'toView',
    value: function toView(routes) {
      var _this = this;

      return routes.filter(function (r) {
        return _this.auth.isAuthorised(r.config.auth);
      });
    }
  }]);

  var _AuthFilterValueConverter = AuthFilterValueConverter;
  AuthFilterValueConverter = (0, _aureliaFramework.inject)(_authentication.Authentication)(AuthFilterValueConverter) || AuthFilterValueConverter;
  return AuthFilterValueConverter;
})();

exports.AuthFilterValueConverter = AuthFilterValueConverter;