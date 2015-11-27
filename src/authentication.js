import {inject} from 'aurelia-framework';
import {BaseConfig}  from './baseConfig';
import {Storage} from './storage';
import authUtils from './authUtils';
@inject(Storage, BaseConfig)
export class Authentication{
  constructor( storage, config){
    this.storage = storage;
    this.config = config.current;
    this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_'
    + this.config.tokenName : this.config.tokenName;
  }
  getLoginRoute(){
    return this.config.loginRoute;
  };

  getLoginRedirect(){
    return this.config.loginRedirect;
  }

  getLoginUrl() {
    return  this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
  };

  getSignupUrl(){
    return  this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
  };

  getProfileUrl() {
    return  this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
  };

  getToken() {
    return this.storage.get(this.tokenName);
  };

  getPayload() {
    var token = this.storage.get(this.tokenName);

    if (token && token.split('.').length === 3) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
    }
  };

  setToken(response, redirect) {

    var tokenName = this.tokenName;
    var accessToken = response && response.access_token;
    var token;

    if (accessToken) {
      if (authUtils.isObject(accessToken) && authUtils.isObject(accessToken.data)) {
        response = accessToken;
      } else if (authUtils.isString(accessToken)) {
        token = accessToken;
      }
    }

    if (!token && response) {
      token = this.config.tokenRoot && response.content[this.config.tokenRoot]
      ? response.content[this.config.tokenRoot][this.config.tokenName]
      : response.content[this.config.tokenName];
    }

    if (!token) {
      var tokenPath = this.config.tokenRoot
      ? this.config.tokenRoot + '.' + this.config.tokenName
      : this.config.tokenName;

      throw new Error('Expecting a token named "' + tokenPath + '" but instead got: ' + JSON.stringify(response.content));
    }


    this.storage.set(tokenName, token);

    if (this.config.loginRedirect && !redirect) {
      window.location.href =this.config.loginRedirect;
    } else if (redirect && authUtils.isString(redirect)) {
      window.location.href =window.encodeURI(redirect);
    }
  };

  removeToken(){
    this.storage.remove(this.tokenName);
  }

  isAuthenticated() {
    var token = this.storage.get(this.tokenName);

    // There's no token, so user is not authenticated.
    if (!token) {
      return false;
    }

    // There is a token, but in a different format. Return true.
    if (token.split('.').length !== 3) {
      return true;
    }

    var base64Url = token.split('.')[1];
    var base64    = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var exp       = JSON.parse(window.atob(base64)).exp;

    if (exp) {
      return Math.round(new Date().getTime() / 1000) <= exp;
    }

    return true;
  };

  logout(redirect) {
    return new Promise(resolve => {
      this.storage.remove(this.tokenName);

      if (this.config.logoutRedirect && !redirect) {
        window.location.href = this.config.logoutRedirect;
      } else if (authUtils.isString(redirect)) {
        window.location.href = redirect;
      }

      resolve();
    });
  };
}
