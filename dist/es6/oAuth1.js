var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject } from 'aurelia-framework';
import authUtils from './authUtils';
import { Storage } from './storage';
import { Popup } from './popup';
import { BaseConfig } from './baseConfig';
import { HttpClient, json } from 'aurelia-fetch-client';
export let OAuth1 = class {
    constructor(storage, popup, http, config) {
        this.storage = storage;
        this.popup = popup;
        this.http = http;
        this.storage = storage;
        this.config = config.current;
        this.popup = popup;
        this.http = http;
        this.defaults = {
            url: null,
            name: null,
            popupOptions: null,
            redirectUri: null,
            authorizationEndpoint: null
        };
    }
    open(options, userData) {
        authUtils.extend(this.defaults, options);
        var serverUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.defaults.url) : this.defaults.url;
        if (this.config.platform !== 'mobile') {
            this.popup = this.popup.open('', this.defaults.name, this.defaults.popupOptions, this.defaults.redirectUri);
        }
        var self = this;
        return this.http.fetch(serverUrl, {
            method: 'post'
        })
            .then(status)
            .then(toJson)
            .then(response => {
            if (self.config.platform === 'mobile') {
                self.popup = self.popup.open([
                    self.defaults.authorizationEndpoint,
                    self.buildQueryString(response.content)
                ].join('?'), self.defaults.name, self.defaults.popupOptions, self.defaults.redirectUri);
            }
            else {
                self.popup.popupWindow.location = [
                    self.defaults.authorizationEndpoint,
                    self.buildQueryString(response.content)
                ].join('?');
            }
            var popupListener = self.config.platform === 'mobile' ? self.popup.eventListener(self.defaults.redirectUri) : self.popup.pollPopup();
            return popupListener.then((response) => {
                return self.exchangeForToken(response, userData);
            });
        });
    }
    exchangeForToken(oauthData, userData) {
        var data = authUtils.extend({}, userData, oauthData);
        var exchangeForTokenUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.defaults.url) : this.defaults.url;
        return this.http.fetch(exchangeForTokenUrl, {
            method: 'post',
            body: json(data),
            credentials: this.config.withCredentials
        })
            .then(status)
            .then(toJson)
            .then(response => {
            return response;
        });
    }
    buildQueryString(obj) {
        var str = [];
        authUtils.forEach(obj, function (value, key) {
            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        });
        return str.join('&');
    }
};
OAuth1 = __decorate([
    inject(Storage, Popup, HttpClient, BaseConfig), 
    __metadata('design:paramtypes', [Storage, Popup, HttpClient, BaseConfig])
], OAuth1);
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    }
    else {
        return Promise.reject(new Error(response.statusText));
    }
}
function toJson(response) {
    return response.json();
}
