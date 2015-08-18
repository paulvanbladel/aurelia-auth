define(['exports', './authUtils', './baseConfig', 'aurelia-framework'], function (exports, _authUtils, _baseConfig, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _authUtils2 = _interopRequireDefault(_authUtils);

  var Popup = (function () {
    function Popup(config) {
      _classCallCheck(this, _Popup);

      this.config = config.current;
      this.popupWindow = null;
      this.polling = null;
      this.url = '';
    }

    _createClass(Popup, [{
      key: 'open',
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
      key: 'eventListener',
      value: function eventListener(redirectUri) {
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
              var hash = _authUtils2['default'].parseQueryString(hashParams);
              var qs = _authUtils2['default'].parseQueryString(queryParams);

              _authUtils2['default'].extend(qs, hash);

              if (qs.error) {
                reject({ error: qs.error });
              } else {
                resolve(qs);
              }

              self.popupWindow.close();
            }
          });

          popupWindow.addEventListener('exit', function () {
            reject({ data: 'Provider Popup was closed' });
          });

          popupWindow.addEventListener('loaderror', function () {
            deferred.reject({ data: 'Authorization Failed' });
          });
        });
        return promise;
      }
    }, {
      key: 'pollPopup',
      value: function pollPopup() {
        var _this = this;

        var self = this;
        var promise = new Promise(function (resolve, reject) {
          _this.polling = setInterval(function () {
            try {
              var documentOrigin = document.location.host;
              var popupWindowOrigin = self.popupWindow.location.host;

              if (popupWindowOrigin === documentOrigin && (self.popupWindow.location.search || self.popupWindow.location.hash)) {
                var queryParams = self.popupWindow.location.search.substring(1).replace(/\/$/, '');
                var hashParams = self.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
                var hash = _authUtils2['default'].parseQueryString(hashParams);
                var qs = _authUtils2['default'].parseQueryString(queryParams);

                _authUtils2['default'].extend(qs, hash);

                if (qs.error) {
                  reject({ error: qs.error });
                } else {
                  resolve(qs);
                }

                self.popupWindow.close();
                clearInterval(self.polling);
              }
            } catch (error) {}

            if (!self.popupWindow) {
              clearInterval(self.polling);
              reject({ data: 'Provider Popup Blocked' });
            } else if (self.popupWindow.closed) {
              clearInterval(self.polling);
              reject({ data: 'Problem poll popup' });
            }
          }, 35);
        });
        return promise;
      }
    }, {
      key: 'prepareOptions',
      value: function prepareOptions(options) {
        var width = options.width || 500;
        var height = options.height || 500;
        return _authUtils2['default'].extend({
          width: width,
          height: height,
          left: window.screenX + (window.outerWidth - width) / 2,
          top: window.screenY + (window.outerHeight - height) / 2.5
        }, options);
      }
    }, {
      key: 'stringifyOptions',
      value: function stringifyOptions(options) {
        var parts = [];
        _authUtils2['default'].forEach(options, function (value, key) {
          parts.push(key + '=' + value);
        });
        return parts.join(',');
      }
    }]);

    var _Popup = Popup;
    Popup = (0, _aureliaFramework.inject)(_baseConfig.BaseConfig)(Popup) || Popup;
    return Popup;
  })();

  exports.Popup = Popup;
});