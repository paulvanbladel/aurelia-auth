import authUtils from './authUtils';
import {BaseConfig}  from './baseConfig';
import {inject} from 'aurelia-dependency-injection';

@inject(BaseConfig)
export class Popup {
  constructor(config) {
    this.config = config.current;
    this.popupWindow = null;
    this.polling = null;
    this.url = '';
  }

  open(url, windowName, options, redirectUri) {
    this.url = url;
    let optionsString = this.stringifyOptions(this.prepareOptions(options || {}));

    this.popupWindow = window.open(url, windowName, optionsString);

    if (this.popupWindow && this.popupWindow.focus) {
      this.popupWindow.focus();
    }

    return this;
  }

  eventListener(redirectUri) {
    return new Promise((resolve, reject) => {
      this.popupWindow.addEventListener('loadstart', (event) => {
        if (event.url.indexOf(redirectUri) !== 0) {
          return;
        }

        let parser = document.createElement('a');
        parser.href = event.url;

        if (parser.search || parser.hash) {
          let queryParams = parser.search.substring(1).replace(/\/$/, '');
          let hashParams = parser.hash.substring(1).replace(/\/$/, '');
          let hash = authUtils.parseQueryString(hashParams);
          let qs = authUtils.parseQueryString(queryParams);

          authUtils.extend(qs, hash);

          if (qs.error) {
            reject({ error: qs.error });
          } else {
            resolve(qs);
          }

          this.popupWindow.close();
        }
      });

      popupWindow.addEventListener('exit', () => {
        reject({ data: 'Provider Popup was closed' });
      });

      popupWindow.addEventListener('loaderror', () => {
        reject({ data: 'Authorization Failed' });
      });
    });
  }

  pollPopup() {
    return new Promise((resolve, reject) => {
      this.polling = setInterval(() => {
        let documentOrigin = document.location.host;
        let popupWindowOrigin = this.popupWindow.location.host;

        if (popupWindowOrigin === documentOrigin && (this.popupWindow.location.search || this.popupWindow.location.hash)) {
          let queryParams = this.popupWindow.location.search.substring(1).replace(/\/$/, '');
          let hashParams = this.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
          let hash = authUtils.parseQueryString(hashParams);
          let qs = authUtils.parseQueryString(queryParams);

          authUtils.extend(qs, hash);

          if (qs.error) {
            reject({ error: qs.error });
          } else {
            resolve(qs);
          }

          this.popupWindow.close();
          clearInterval(this.polling);
        }

        if (!this.popupWindow) {
          clearInterval(this.polling);
          reject({ data: 'Provider Popup Blocked' });
        } else if (this.popupWindow.closed) {
          clearInterval(this.polling);
          reject({ data: 'Problem poll popup' });
        }
      }, 35);
    });
  }

  prepareOptions(options) {
    let width = options.width || 500;
    let height = options.height || 500;
    return authUtils.extend({
      width: width,
      height: height,
      left: window.screenX + ((window.outerWidth - width) / 2),
      top: window.screenY + ((window.outerHeight - height) / 2.5)
    }, options);
  }

  stringifyOptions(options) {
    let parts = [];
    authUtils.forEach(options, function(value, key) {
      parts.push(key + '=' + value);
    });
    return parts.join(',');
  }
}
