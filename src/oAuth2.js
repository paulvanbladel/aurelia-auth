import {inject} from 'aurelia-dependency-injection';
import authUtils from './authUtils';
import {Storage} from './storage';
import {Popup} from './popup';
import {BaseConfig} from './baseConfig';
import {Authentication} from './authentication';
import {HttpClient, json} from 'aurelia-fetch-client';
import 'fetch';

@inject(Storage, Popup, HttpClient, BaseConfig, Authentication)
export class OAuth2 {
  constructor(storage, popup, http, config, auth) {
    this.storage = storage;
    this.config = config.current;
    this.popup = popup;
    this.http = http;
    this.auth = auth;
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
    let current = authUtils.extend({}, this.defaults, options);

    //state handling
    let stateName = current.name + '_state';

    if (authUtils.isFunction(current.state)) {
      this.storage.set(stateName, current.state());
    } else if (authUtils.isString(current.state)) {
      this.storage.set(stateName, current.state);
    }

    //nonce handling
    let nonceName = current.name + '_nonce';

    if (authUtils.isFunction(current.nonce)) {
      this.storage.set(nonceName, current.nonce());
    } else if (authUtils.isString(current.nonce)) {
      this.storage.set(nonceName, current.nonce);
    }

    let url = current.authorizationEndpoint + '?' + this.buildQueryString(current);

    let openPopup;
    if (this.config.platform === 'mobile') {
      openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).eventListener(current.redirectUri);
    } else {
      openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).pollPopup();
    }

    return openPopup
      .then(oauthData => {
        if (oauthData.state && oauthData.state !== this.storage.get(stateName)) {
          return Promise.reject('OAuth 2.0 state parameter mismatch.');
        }

        if (current.responseType.toUpperCase().includes('TOKEN')) { //meaning implicit flow or hybrid flow
            if (!this.verifyIdToken(oauthData, current.name)){
                return Promise.reject('OAuth 2.0 Nonce parameter mismatch.');
            };
          return oauthData;
        }

        return this.exchangeForToken(oauthData, userData, current); //responseType is authorization code only (no token nor id_token)
      });
  };


    verifyIdToken(oauthData, providerName){

        let idToken = oauthData && oauthData[this.config.responseIdTokenProp];
        if(!idToken) return true;
        let idTokenObject = this.auth.decomposeToken(idToken);
        if(!idTokenObject) return true;
        let nonceFromToken = idTokenObject.nonce;
        if(!nonceFromToken) return true;
        let nonceInStorage = this.storage.get(providerName + '_nonce');
        if (nonceFromToken!==nonceInStorage) {
            return false;
        }
        return true;
    };

  exchangeForToken(oauthData, userData, current) {
    let data = authUtils.extend({}, userData, {
      code: oauthData.code,
      clientId: current.clientId,
      redirectUri: current.redirectUri
    });

    if (oauthData.state) {
      data.state = oauthData.state;
    }

    authUtils.forEach(current.responseParams, param => data[param] = oauthData[param]);

    let exchangeForTokenUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, current.url) : current.url;
    let credentials         = this.config.withCredentials ? 'include' : 'same-origin';

    return this.http.fetch(exchangeForTokenUrl, {
      method: 'post',
      body: json(data),
      credentials: credentials
    })
      .then(authUtils.status)
      .then((response) => {
        return response;
      });
  }

  buildQueryString(current) {
    let keyValuePairs = [];
    let urlParams     = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

    authUtils.forEach(urlParams, params => {
      authUtils.forEach(current[params], paramName => {
        let camelizedName = authUtils.camelCase(paramName);
        let paramValue    = authUtils.isFunction(current[paramName]) ? current[paramName]() : current[camelizedName];

        if (paramName === 'state') {
          let stateName = current.name + '_state';
          paramValue    = encodeURIComponent(this.storage.get(stateName));
        }

        if (paramName === 'nonce') {
          let nonceName = current.name + '_nonce';
          paramValue    = encodeURIComponent(this.storage.get(nonceName));
        }

        if (paramName === 'scope' && Array.isArray(paramValue)) {
          paramValue = paramValue.join(current.scopeDelimiter);

          if (current.scopePrefix) {
            paramValue = [current.scopePrefix, paramValue].join(current.scopeDelimiter);
          }
        }

        keyValuePairs.push([paramName, paramValue]);
      });
    });

    return keyValuePairs.map(pair => pair.join('=')).join('&');
  }
}
