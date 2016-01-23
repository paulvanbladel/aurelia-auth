System.register(["aurelia-framework", "./authentication", "aurelia-router"], function (_export) {
    "use strict";

    var inject, Authentication, Redirect, __decorate, __metadata, AuthorizeStep;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [function (_aureliaFramework) {
            inject = _aureliaFramework.inject;
        }, function (_authentication) {
            Authentication = _authentication.Authentication;
        }, function (_aureliaRouter) {
            Redirect = _aureliaRouter.Redirect;
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

            AuthorizeStep = (function () {
                function AuthorizeStep(auth) {
                    _classCallCheck(this, AuthorizeStep);

                    this.auth = auth;
                }

                _createClass(AuthorizeStep, [{
                    key: "run",
                    value: function run(routingContext, next) {
                        var isLoggedIn = this.auth.isAuthenticated();
                        var loginRoute = this.auth.getLoginRoute();
                        if (routingContext.getAllInstructions().some(function (i) {
                            return i.config.auth;
                        })) {
                            if (!isLoggedIn) {
                                console.log("login route : " + loginRoute);
                                return next.cancel(new Redirect(loginRoute));
                            }
                        } else if (isLoggedIn && routingContext.getAllInstructions().some(function (i) {
                            return i.fragment;
                        }) == loginRoute) {
                            var loginRedirect = this.auth.getLoginRedirect();
                            return next.cancel(new Redirect(loginRedirect));
                        }
                        return next();
                    }
                }]);

                return AuthorizeStep;
            })();

            _export("AuthorizeStep", AuthorizeStep);

            _export("AuthorizeStep", AuthorizeStep = __decorate([inject(Authentication), __metadata('design:paramtypes', [Authentication])], AuthorizeStep));
        }
    };
});