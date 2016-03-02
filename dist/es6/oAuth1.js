import {inject} from 'aurelia-dependency-injection';
import authUtils from './authUtils';
import {Storage} from './storage';
import {Popup} from './popup';
import {BaseConfig} from './baseConfig';
import {HttpClient, json} from 'aurelia-fetch-client';
import 'fetch';

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
    let current = authUtils.extend({}, this.defaults, options);

    let serverUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, current.url) : current.url;

    if (this.config.platform !== 'mobile') {
      this.popup = this.popup.open('', current.name, current.popupOptions, current.redirectUri);
    }
    return this.http.fetch(serverUrl, {
      method: 'post'
    })
      .then(authUtils.status)
      .then(response => {
        if (this.config.platform === 'mobile') {
          this.popup = this.popup.open(
            [
              current.authorizationEndpoint,
              this.buildQueryString(response.content)
            ].join('?'),
            current.name,
            current.popupOptions,
            current.redirectUri);
        } else {
          this.popup.popupWindow.location = [
            current.authorizationEndpoint,
            this.buildQueryString(response.content)
          ].join('?');
        }

        let popupListener = this.config.platform === 'mobile' ? this.popup.eventListener(current.redirectUri) : this.popup.pollPopup();

        return popupListener.then(result => this.exchangeForToken(result, userData, current));
      });
  }

  exchangeForToken(oauthData, userData, current) {
    let data                = authUtils.extend({}, userData, oauthData);
    let exchangeForTokenUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, current.url) : current.url;
    let credentials         = this.config.withCredentials ? 'include' : 'same-origin';

    return this.http.fetch(exchangeForTokenUrl, {
      method: 'post',
      body: json(data),
      credentials: credentials
    })
    .then(authUtils.status);
  }

  buildQueryString(obj) {
    let str = [];

    authUtils.forEach(obj, (value, key) => str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value)));

    return str.join('&');
  }
}
