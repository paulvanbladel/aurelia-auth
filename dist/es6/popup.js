var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import authUtils from './authUtils';
import { BaseConfig } from './baseConfig';
import { inject } from 'aurelia-framework';
export let Popup = class {
    constructor(config) {
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
                    }
                    else {
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
                        }
                        else {
                            resolve(qs);
                        }
                        self.popupWindow.close();
                        clearInterval(self.polling);
                    }
                }
                catch (error) { }
                if (!self.popupWindow) {
                    clearInterval(self.polling);
                    reject({
                        data: 'Provider Popup Blocked'
                    });
                }
                else if (self.popupWindow.closed) {
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
        authUtils.forEach(options, function (value, key) {
            parts.push(key + '=' + value);
        });
        return parts.join(',');
    }
};
Popup = __decorate([
    inject(BaseConfig), 
    __metadata('design:paramtypes', [BaseConfig])
], Popup);
