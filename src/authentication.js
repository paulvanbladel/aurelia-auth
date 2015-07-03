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

getLoginUrl() {
  return  this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
};

getSignupUrl(){
  return  this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
};

getToken() {
  return this.storage.get(this.tokenName);
};

getPayload() {
  var token = this.storage.get(this.tokenName);

  if (token && token.split('.').length === 3) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
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

  if (token) {
    if (token.split('.').length === 3) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      var exp = JSON.parse(window.atob(base64)).exp;
      if (exp) {
        return Math.round(new Date().getTime() / 1000) <= exp;
      }
      return true;
    }
    return true;
  }
  return false;
};

logout(redirect) {
  var tokenName = this.tokenName;
  return  new Promise((resolve,reject)=>{
  this.storage.remove(tokenName);
  //var this.config = this.this.config;
  if (this.config.logoutRedirect && !redirect) {
    window.location.href = this.config.logoutRedirect;
  }
  else if (authUtils.isString(redirect)) {
    //window.location.href =redirect;
    //this.router.navigate(redirect);
    window.location.href = redirect;

  }
  resolve();
});
  
};
}