/* global deferred */
import authUtils from './authUtils';
import {BaseConfig, IBaseConfig}  from './baseConfig';
import {inject} from 'aurelia-framework';
@inject(BaseConfig)
export class Popup {
  config: IBaseConfig;
  popupWindow: any;
  polling: any;
  url: string;
  constructor(config: BaseConfig) {
    this.config = config.current;
    this.popupWindow = null;
    this.polling = null;
    this.url = '';
  }

  open(url, windowName, options, redirectUri) {
    this.url = url;
    var optionsString = this.stringifyOptions(this.prepareOptions(options || {}));

    this.popupWindow = window.open(url, windowName, optionsString);

    if (this.popupWindow && this.popupWindow.focus) {
      this.popupWindow.focus();
    }

    return this;
  }

  eventListener(redirectUri) {
    var self = this;
    var promise = new Promise((resolve, reject) => {
      self.popupWindow.addEventListener('loadstart', (event) => {
        if (event.url.indexOf(redirectUri) !== 0) {
          return;
        }

        var parser = document.createElement('a');
        parser.href = event.url;

        if (parser.search || parser.hash) {
          var queryParams = parser.search.substring(1).replace(/\/$/, '');
          var hashParams = parser.hash.substring(1).replace(/\/$/, '');
          var hash = authUtils.parseQueryString(hashParams);
          var qs = authUtils.parseQueryString(queryParams);

          authUtils.extend(qs, hash);

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

      this.popupWindow.addEventListener('exit', () => {
        reject({
          data: 'Provider Popup was closed'
        });
      });

      this.popupWindow.addEventListener('loaderror', () => {
        reject({
          data: 'Authorization Failed'
        });
      });
    });
    return promise;
  }

  pollPopup() {
    var self = this;
    var promise = new Promise((resolve, reject) => {
      this.polling = setInterval(() => {
        try {
          var documentOrigin = document.location.host;
          var popupWindowOrigin = self.popupWindow.location.host;

          if (popupWindowOrigin === documentOrigin && (self.popupWindow.location.search || self.popupWindow.location.hash)) {
            var queryParams = self.popupWindow.location.search.substring(1).replace(/\/$/, '');
            var hashParams = self.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
            var hash = authUtils.parseQueryString(hashParams);
            var qs = authUtils.parseQueryString(queryParams);

            authUtils.extend(qs, hash);

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
        } catch (error) { }

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

  prepareOptions(options) {
    var width = options.width || 500;
    var height = options.height || 500;
    return authUtils.extend({
      width: width,
      height: height,
      left: window.screenX + ((window.outerWidth - width) / 2),
      top: window.screenY + ((window.outerHeight - height) / 2.5)
    }, options);
  }

  stringifyOptions(options) {
    var parts = [];
    authUtils.forEach(options, function(value, key) {
      parts.push(key + '=' + value);
    });
    return parts.join(',');
  }
}
