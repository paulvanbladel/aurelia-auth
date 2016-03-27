"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthFilterValueConverter = exports.AuthFilterValueConverter = function () {
  function AuthFilterValueConverter() {
    _classCallCheck(this, AuthFilterValueConverter);
  }

  AuthFilterValueConverter.prototype.toView = function toView(routes, isAuthenticated) {
    return routes.filter(function (r) {
      return r.config.auth === undefined || r.config.auth === isAuthenticated;
    });
  };

  return AuthFilterValueConverter;
}();