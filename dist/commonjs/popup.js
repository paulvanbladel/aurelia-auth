"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _authUtils = require('./authUtils');

var _authUtils2 = _interopRequireDefault(_authUtils);

var _baseConfig = require('./baseConfig');

var _aureliaFramework = require('aurelia-framework');

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = undefined && undefined.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Popup = (function () {
    function Popup(config) {
        _classCallCheck(this, Popup);

        this.config = config.current;
        this.popupWindow = null;
        this.polling = null;
        this.url = '';
    }

    _createClass(Popup, [{
        key: "open",
        value: function open(url, windowName, options, redirectUri) {
            this.url = url;
            var optionsString = this.stringifyOptions(this.prepareOptions(options || {}));
            this.popupWindow = window.open(url, windowName, optionsString);
            if (this.popupWindow && this.popupWindow.focus) {
                this.popupWindow.focus();
            }
            return this;
        }
    }, {
        key: "eventListener",
        value: function eventListener(redirectUri) {
            var _this = this;

            var self = this;
            var promise = new Promise(function (resolve, reject) {
                self.popupWindow.addEventListener('loadstart', function (event) {
                    if (event.url.indexOf(redirectUri) !== 0) {
                        return;
                    }
                    var parser = document.createElement('a');
                    parser.href = event.url;
                    if (parser.search || parser.hash) {
                        var queryParams = parser.search.substring(1).replace(/\/$/, '');
                        var hashParams = parser.hash.substring(1).replace(/\/$/, '');
                        var hash = _authUtils2["default"].parseQueryString(hashParams);
                        var qs = _authUtils2["default"].parseQueryString(queryParams);
                        _authUtils2["default"].extend(qs, hash);
                        if (qs.error) {
                            reject({
                                error: qs.error
                            });
                        } else {
                            resolve(qs);
                        }
                        self.popupWindow.close();
                    }
                });
                _this.popupWindow.addEventListener('exit', function () {
                    reject({
                        data: 'Provider Popup was closed'
                    });
                });
                _this.popupWindow.addEventListener('loaderror', function () {
                    reject({
                        data: 'Authorization Failed'
                    });
                });
            });
            return promise;
        }
    }, {
        key: "pollPopup",
        value: function pollPopup() {
            var _this2 = this;

            var self = this;
            var promise = new Promise(function (resolve, reject) {
                _this2.polling = setInterval(function () {
                    try {
                        var documentOrigin = document.location.host;
                        var popupWindowOrigin = self.popupWindow.location.host;
                        if (popupWindowOrigin === documentOrigin && (self.popupWindow.location.search || self.popupWindow.location.hash)) {
                            var queryParams = self.popupWindow.location.search.substring(1).replace(/\/$/, '');
                            var hashParams = self.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
                            var hash = _authUtils2["default"].parseQueryString(hashParams);
                            var qs = _authUtils2["default"].parseQueryString(queryParams);
                            _authUtils2["default"].extend(qs, hash);
                            if (qs.error) {
                                reject({
                                    error: qs.error
                                });
                            } else {
                                resolve(qs);
                            }
                            self.popupWindow.close();
                            clearInterval(self.polling);
                        }
                    } catch (error) {}
                    if (!self.popupWindow) {
                        clearInterval(self.polling);
                        reject({
                            data: 'Provider Popup Blocked'
                        });
                    } else if (self.popupWindow.closed) {
                        clearInterval(self.polling);
                        reject({
                            data: 'Problem poll popup'
                        });
                    }
                }, 35);
            });
            return promise;
        }
    }, {
        key: "prepareOptions",
        value: function prepareOptions(options) {
            var width = options.width || 500;
            var height = options.height || 500;
            return _authUtils2["default"].extend({
                width: width,
                height: height,
                left: window.screenX + (window.outerWidth - width) / 2,
                top: window.screenY + (window.outerHeight - height) / 2.5
            }, options);
        }
    }, {
        key: "stringifyOptions",
        value: function stringifyOptions(options) {
            var parts = [];
            _authUtils2["default"].forEach(options, function (value, key) {
                parts.push(key + '=' + value);
            });
            return parts.join(',');
        }
    }]);

    return Popup;
})();
exports.Popup = Popup;
exports.Popup = Popup = __decorate([(0, _aureliaFramework.inject)(_baseConfig.BaseConfig), __metadata('design:paramtypes', [_baseConfig.BaseConfig])], Popup);