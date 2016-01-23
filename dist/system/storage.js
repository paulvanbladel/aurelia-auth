System.register(["aurelia-framework", "./baseConfig"], function (_export) {
    "use strict";

    var inject, BaseConfig, __decorate, __metadata, Storage;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    return {
        setters: [function (_aureliaFramework) {
            inject = _aureliaFramework.inject;
        }, function (_baseConfig) {
            BaseConfig = _baseConfig.BaseConfig;
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

            Storage = (function () {
                function Storage(config) {
                    _classCallCheck(this, Storage);

                    this.config = config.current;
                }

                _createClass(Storage, [{
                    key: "get",
                    value: function get(key) {
                        switch (this.config.storage) {
                            case 'localStorage':
                                if ('localStorage' in window && window['localStorage'] !== null) {
                                    return localStorage.getItem(key);
                                } else {
                                    console.warn('Warning: Local Storage is disabled or unavailable');
                                    return undefined;
                                }
                                break;
                            case 'sessionStorage':
                                if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                                    return sessionStorage.getItem(key);
                                } else {
                                    console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');
                                    return undefined;
                                }
                                break;
                        }
                    }
                }, {
                    key: "set",
                    value: function set(key, value) {
                        switch (this.config.storage) {
                            case 'localStorage':
                                if ('localStorage' in window && window['localStorage'] !== null) {
                                    return localStorage.setItem(key, value);
                                } else {
                                    console.warn('Warning: Local Storage is disabled or unavailable.  will not work correctly.');
                                    return undefined;
                                }
                                break;
                            case 'sessionStorage':
                                if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                                    return sessionStorage.setItem(key, value);
                                } else {
                                    console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');
                                    return undefined;
                                }
                                break;
                        }
                    }
                }, {
                    key: "remove",
                    value: function remove(key) {
                        switch (this.config.storage) {
                            case 'localStorage':
                                if ('localStorage' in window && window['localStorage'] !== null) {
                                    return localStorage.removeItem(key);
                                } else {
                                    console.warn('Warning: Local Storage is disabled or unavailable.  will not work correctly.');
                                    return undefined;
                                }
                                break;
                            case 'sessionStorage':
                                if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                                    return sessionStorage.removeItem(key);
                                } else {
                                    console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');
                                    return undefined;
                                }
                                break;
                        }
                    }
                }]);

                return Storage;
            })();

            _export("Storage", Storage);

            _export("Storage", Storage = __decorate([inject(BaseConfig), __metadata('design:paramtypes', [Object])], Storage));
        }
    };
});