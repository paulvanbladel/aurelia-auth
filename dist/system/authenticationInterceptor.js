System.register([], function (_export) {
  "use strict";

  var AuthenticateInterceptor;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [],
    execute: function () {
      AuthenticateInterceptor = (function () {
        function AuthenticateInterceptor() {
          _classCallCheck(this, AuthenticateInterceptor);
        }

        _createClass(AuthenticateInterceptor, [{
          key: "request",
          value: function request(message) {
            if (message.noAuthToken) {
              console.log("no auth token handling in auth interceptor");
            } else {
              console.log("here the interceptor should add the json token");
            }

            return message;
          }
        }, {
          key: "response",
          value: function response(message) {
            if (true) {
              return message;
            } else {
              throw new Error("not-authenticated");
            }
          }
        }]);

        return AuthenticateInterceptor;
      })();

      _export("AuthenticateInterceptor", AuthenticateInterceptor);
    }
  };
});