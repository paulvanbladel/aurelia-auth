import {inject} from 'aurelia-framework';
import authUtils from './authUtils';
import {Storage} from './storage';
import {Popup} from './popup';
import {BaseConfig, IBaseConfig} from './baseConfig';
import {HttpClient, json} from 'aurelia-fetch-client';


@inject(Storage, Popup, HttpClient, BaseConfig)
export class OAuth2 {
    config: IBaseConfig
    defaults: IOAuthDefaults;
    constructor(private storage: Storage, private popup: Popup, private http: HttpClient, config: BaseConfig) {
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

    return this.http.fetch(exchangeForTokenUrl, {
      method: 'post',
      body: json(data),
      credentials: <string>this.config.withCredentials
    })
      .then(status)
      .then(toJson)
      .then((response) => {
        return response
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

}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function toJson(response) {
  return response.json()
}

export interface IOAuthDefaults {
    url?: string;
    name?: string;
    state?: any;
    scope?: any;
    scopeDelimiter?: any;
    redirectUri?: any;
    popupOptions?: any;
    authorizationEndpoint?: any;
    responseParams?: any;
    requiredUrlParams?: any;
    optionalUrlParams?: any;
    defaultUrlParams?: string[];
    responseType?: string;
    clientId?: string;
    scopePrefix?: string;
}
    