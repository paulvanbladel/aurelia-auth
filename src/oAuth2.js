import {inject} from 'aurelia-framework';
import {authUtils} from './authUtils';
import {Storage} from './storage';
import {Popup} from './popup';
import {BaseConfig} from './baseConfig';
import {HttpClient} from 'aurelia-http-client';

@inject(Storage, Popup, HttpClient, BaseConfig)
export class OAuth2 {
  constructor(storage, popup, http, config) {
    this.storage = storage;
    this.config = config.current;
    this.popup = popup;
    this.http = http;
    this.defaults = {
      url: null,
      name: null,
      state: null,
      scope: null,
      scopeDelimiter: null,
      redirectUri: null,
      popupOptions: null,
      authorizationEndpoint: null,
      responseParams: null,
      requiredUrlParams: null,
      optionalUrlParams: null,
      defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
      responseType: 'code'
    };
  }

  open(options, userData) {
    authUtils.extend(this.defaults, options);
    var stateName = this.defaults.name + '_state';

    if (authUtils.isFunction(this.defaults.state)) {
      this.storage.set(stateName, this.defaults.state());
    } else if (authUtils.isString(this.defaults.state)) {
      this.storage.set(stateName, this.defaults.state);
    }

    var url = this.defaults.authorizationEndpoint + '?' + this.buildQueryString();

    var openPopup;
    if (this.config.platform === 'mobile') {
      openPopup = this.popup.open(url, this.defaults.name, this.defaults.popupOptions, this.defaults.redirectUri).eventListener(this.defaults.redirectUri);
    } else {
      openPopup = this.popup.open(url, this.defaults.name, this.defaults.popupOptions, this.defaults.redirectUri).pollPopup();
    }

    var self = this;
    return openPopup
      .then((oauthData) => {
        if (self.defaults.responseType === 'token' ||
            self.defaults.responseType === 'id_token%20token' ||
            self.defaults.responseType === 'token%20id_token'
           ) {
             return oauthData;
           }
        if (oauthData.state && oauthData.state !== self.storage.get(stateName)) {
          return Promise.reject('OAuth 2.0 state parameter mismatch.');
        }
        return self.exchangeForToken(oauthData, userData);
      });
  }

  exchangeForToken(oauthData, userData) {
    var data = authUtils.extend({}, userData, {
      code: oauthData.code,
      clientId: this.defaults.clientId,
      redirectUri: this.defaults.redirectUri
    });

    if (oauthData.state) {
      data.state = oauthData.state;
    }

    authUtils.forEach(this.defaults.responseParams, function(param) {
      data[param] = oauthData[param];
    });

    var exchangeForTokenUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.defaults.url) : this.defaults.url;


    return this.http.createRequest(exchangeForTokenUrl)
      .asPost()
      .withContent(data)
      .withCredentials(this.config.withCredentials)
      .send()
      .then(response => {
        return response;
      });
  }

  buildQueryString() {
    var keyValuePairs = [];
    var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];
    authUtils.forEach(urlParams, (params) => {

      authUtils.forEach(this.defaults[params], (paramName) => {
        var camelizedName = authUtils.camelCase(paramName);
        var paramValue = authUtils.isFunction(this.defaults[paramName]) ? this.defaults[paramName]() : this.defaults[camelizedName];

        if (paramName === 'state') {
          var stateName = this.defaults.name + '_state';
          paramValue = encodeURIComponent(this.storage.get(stateName));
        }

        if (paramName === 'scope' && Array.isArray(paramValue)) {
          paramValue = paramValue.join(this.defaults.scopeDelimiter);

          if (this.defaults.scopePrefix) {
            paramValue = [this.defaults.scopePrefix, paramValue].join(this.defaults.scopeDelimiter);
          }
        }

        keyValuePairs.push([paramName, paramValue]);
      });
    });

    return keyValuePairs.map(function(pair) {
      return pair.join('=');
    }).join('&');
  }

};
