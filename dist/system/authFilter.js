System.register(['aurelia-dependency-injection', './authentication'], function (_export) {
  'use strict';

  var inject, Authentication, AuthFilterValueConverter;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_authentication) {
      Authentication = _authentication.Authentication;
    }],
    execute: function () {
      AuthFilterValueConverter = (function () {
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
        AuthFilterValueConverter = inject(Authentication)(AuthFilterValueConverter) || AuthFilterValueConverter;
        return AuthFilterValueConverter;
      })();

      _export('AuthFilterValueConverter', AuthFilterValueConverter);
    }
  };
});