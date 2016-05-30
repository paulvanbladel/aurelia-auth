"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var AuthFilterValueConverter;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export("AuthFilterValueConverter", AuthFilterValueConverter = function () {
        function AuthFilterValueConverter() {
          _classCallCheck(this, AuthFilterValueConverter);
        }

        AuthFilterValueConverter.prototype.toView = function toView(routes, isAuthenticated) {
          return routes.filter(function (r) {
            return r.config.auth === undefined || r.config.auth === isAuthenticated;
          });
        };

        return AuthFilterValueConverter;
      }());

      _export("AuthFilterValueConverter", AuthFilterValueConverter);
    }
  };
});