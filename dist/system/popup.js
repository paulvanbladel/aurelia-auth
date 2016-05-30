'use strict';

System.register(['./auth-utilities', './base-config', 'aurelia-dependency-injection'], function (_export, _context) {
  "use strict";

  var parseQueryString, extend, forEach, BaseConfig, inject, _dec, _class, Popup;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_authUtilities) {
      parseQueryString = _authUtilities.parseQueryString;
      extend = _authUtilities.extend;
      forEach = _authUtilities.forEach;
    }, function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }],
    execute: function () {
      _export('Popup', Popup = (_dec = inject(BaseConfig), _dec(_class = function () {
        function Popup(config) {
          _classCallCheck(this, Popup);

          this.config = config.current;
          this.popupWindow = null;
          this.polling = null;
          this.url = '';
        }

        Popup.prototype.open = function open(url, windowName, options, redirectUri) {
          this.url = url;
          var optionsString = this.stringifyOptions(this.prepareOptions(options || {}));
          this.popupWindow = window.open(url, windowName, optionsString);
          if (this.popupWindow && this.popupWindow.focus) {
            this.popupWindow.focus();
          }

          return this;
        };

        Popup.prototype.eventListener = function eventListener(redirectUri) {
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
                var hash = parseQueryString(hashParams);
                var qs = parseQueryString(queryParams);

                extend(qs, hash);

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

            popupWindow.addEventListener('exit', function () {
              reject({
                data: 'Provider Popup was closed'
              });
            });

            popupWindow.addEventListener('loaderror', function () {
              deferred.reject({
                data: 'Authorization Failed'
              });
            });
          });
          return promise;
        };

        Popup.prototype.pollPopup = function pollPopup() {
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
                  var hash = parseQueryString(hashParams);
                  var qs = parseQueryString(queryParams);

                  extend(qs, hash);

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
        };

        Popup.prototype.prepareOptions = function prepareOptions(options) {
          var width = options.width || 500;
          var height = options.height || 500;
          return extend({
            width: width,
            height: height,
            left: window.screenX + (window.outerWidth - width) / 2,
            top: window.screenY + (window.outerHeight - height) / 2.5
          }, options);
        };

        Popup.prototype.stringifyOptions = function stringifyOptions(options) {
          var parts = [];
          forEach(options, function (value, key) {
            parts.push(key + '=' + value);
          });
          return parts.join(',');
        };

        return Popup;
      }()) || _class));

      _export('Popup', Popup);
    }
  };
});