import {inject} from 'aurelia-framework';
import authUtils from './authUtils';
import {Storage} from './storage';
import {Popup} from './popup';
import {BaseConfig} from './baseConfig';
import {HttpClient} from 'aurelia-http-client';

@inject(Storage, Popup, HttpClient, BaseConfig)
export class OAuth1 {
  constructor(storage, popup, http, config) {
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
    return this.http.createRequest(serverUrl)
      .asPost()
      .send()
      .then(response => {
        if (self.config.platform === 'mobile') {
          self.popup = self.popup.open(
            [
              self.defaults.authorizationEndpoint,
              self.buildQueryString(response.content)
            ].join('?'),
            self.defaults.name,
            self.defaults.popupOptions,
            self.defaults.redirectUri);
        } else {
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
    return this.http.createRequest(exchangeForTokenUrl)
      .asPost()
      .withCredentials(this.config.withCredentials)
      .withContent(data)
      .send()
      .then(response => {
        return response;
      });

  }

  buildQueryString(obj) {
    var str = [];

    authUtils.forEach(obj, function(value, key) {
      str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });

    return str.join('&');
  }
}
