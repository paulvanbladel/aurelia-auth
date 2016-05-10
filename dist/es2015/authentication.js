var _dec, _class;

import { inject } from 'aurelia-dependency-injection';
import { BaseConfig } from './base-config';
import { Storage } from './storage';
import { joinUrl, isObject, isString } from './auth-utilities';

export let Authentication = (_dec = inject(Storage, BaseConfig), _dec(_class = class Authentication {
  constructor(storage, config) {
    this.storage = storage;
    this.config = config.current;
    this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
    this.idTokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
  }

  getLoginRoute() {
    return this.config.loginRoute;
  }

  getLoginRedirect() {
    return this.initialUrl || this.config.loginRedirect;
  }

  getLoginUrl() {
    return this.config.baseUrl ? joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
  }

  getSignupUrl() {
    return this.config.baseUrl ? joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
  }

  getProfileUrl() {
    return this.config.baseUrl ? joinUrl(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
  }

  getToken() {
    return this.storage.get(this.tokenName);
  }

  getPayload() {
    let token = this.storage.get(this.tokenName);
    return this.decomposeToken(token);
  }

  decomposeToken(token) {
    if (token && token.split('.').length === 3) {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      try {
        return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
      } catch (error) {
        return null;
      }
    }
  }

  setInitialUrl(url) {
    this.initialUrl = url;
  }

  setToken(response, redirect) {
    let accessToken = response && response[this.config.responseTokenProp];
    let tokenToStore;

    if (accessToken) {
      if (isObject(accessToken) && isObject(accessToken.data)) {
        response = accessToken;
      } else if (isString(accessToken)) {
        tokenToStore = accessToken;
      }
    }

    if (!tokenToStore && response) {
      tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
    }

    if (tokenToStore) {
      this.storage.set(this.tokenName, tokenToStore);
    }

    let idToken = response && response[this.config.responseIdTokenProp];

    if (idToken) {
      this.storage.set(this.idTokenName, idToken);
    }

    if (this.config.loginRedirect && !redirect) {
      window.location.href = this.getLoginRedirect();
    } else if (redirect && isString(redirect)) {
      window.location.href = window.encodeURI(redirect);
    }
  }

  removeToken() {
    this.storage.remove(this.tokenName);
  }

  isAuthenticated() {
    let token = this.storage.get(this.tokenName);

    if (!token) {
      return false;
    }

    if (token.split('.').length !== 3) {
      return true;
    }

    let exp;
    try {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      exp = JSON.parse(window.atob(base64)).exp;
    } catch (error) {
      return false;
    }

    if (exp) {
      return Math.round(new Date().getTime() / 1000) <= exp;
    }

    return true;
  }

  logout(redirect) {
    return new Promise(resolve => {
      this.storage.remove(this.tokenName);

      if (this.config.logoutRedirect && !redirect) {
        window.location.href = this.config.logoutRedirect;
      } else if (isString(redirect)) {
        window.location.href = redirect;
      }

      resolve();
    });
  }

  get tokenInterceptor() {
    let config = this.config;
    let storage = this.storage;
    let auth = this;
    return {
      request(request) {
        if (auth.isAuthenticated() && config.httpInterceptor) {
          let tokenName = config.tokenPrefix ? `${ config.tokenPrefix }_${ config.tokenName }` : config.tokenName;
          let token = storage.get(tokenName);

          if (config.authHeader && config.authToken) {
            token = `${ config.authToken } ${ token }`;
          }

          request.headers.set(config.authHeader, token);
        }
        return request;
      }
    };
  }
}) || _class);