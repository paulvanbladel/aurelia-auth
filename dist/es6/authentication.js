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
import { BaseConfig } from './baseConfig';
import { Storage } from './storage';
import authUtils from './authUtils';
export let Authentication = class {
    constructor(storage, config) {
        this.storage = storage;
        this.config = config.current;
        this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_'
            + this.config.tokenName : this.config.tokenName;
        this.refreshTokenName = this.config.refreshTokenPrefix ? this.config.refreshTokenPrefix + '_'
            + this.config.refreshTokenName : this.config.refreshTokenName;
    }
    getLoginRoute() {
        return this.config.loginRoute;
    }
    getLoginRedirect() {
        return this.config.loginRedirect;
    }
    getLoginUrl() {
        return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
    }
    ;
    getSignupUrl() {
        return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
    }
    ;
    getProfileUrl() {
        return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
    }
    ;
    getToken() {
        return this.storage.get(this.tokenName);
    }
    ;
    getRefreshToken() {
        return this.storage.get(this.refreshTokenName);
    }
    getPayload() {
        var token = this.storage.get(this.tokenName);
        if (token && token.split('.').length === 3) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(decodeURIComponent(encodeURI(window.atob(base64))));
        }
    }
    setToken(response, redirect) {
        var tokenName = this.tokenName;
        var accessToken = response && response.access_token;
        var token;
        if (accessToken) {
            if (authUtils.isObject(accessToken) && authUtils.isObject(accessToken.data)) {
                response = accessToken;
            }
            else if (authUtils.isString(accessToken)) {
                token = accessToken;
            }
        }
        if (!token && response) {
            token = this.config.tokenRoot && response[this.config.tokenRoot]
                ? response[this.config.tokenRoot][this.config.tokenName]
                : response[this.config.tokenName];
        }
        if (!token) {
            var tokenPath = this.config.tokenRoot
                ? this.config.tokenRoot + '.' + this.config.tokenName
                : this.config.tokenName;
            throw new Error('Expecting a token named "' + tokenPath + '" but instead got: ' + JSON.stringify(response.content));
        }
        this.storage.set(tokenName, token);
        if (this.config.loginRedirect && !redirect) {
            window.location.href = this.config.loginRedirect;
        }
        else if (redirect && authUtils.isString(redirect)) {
            window.location.href = encodeURI(redirect);
        }
    }
    setRefreshToken(response) {
        var refreshTokenName = this.refreshTokenName;
        var refreshToken = response && response.refresh_token;
        var token;
        if (refreshToken) {
            if (authUtils.isObject(refreshToken) && authUtils.isObject(refreshToken.data)) {
                response = refreshToken;
            }
            else if (authUtils.isString(refreshToken)) {
                token = refreshToken;
            }
        }
        if (!token && response) {
            token = this.config.refreshTokenRoot && response[this.config.refreshTokenRoot]
                ? response[this.config.refreshTokenRoot][this.config.refreshTokenName]
                : response[this.config.refreshTokenName];
        }
        if (!token) {
            var refreshTokenPath = this.config.refreshTokenRoot
                ? this.config.refreshTokenRoot + '.' + this.config.refreshTokenName
                : this.config.refreshTokenName;
            throw new Error('Expecting a refresh token named "' + refreshTokenPath + '" but instead got: ' + JSON.stringify(response.content));
        }
        this.storage.set(refreshTokenName, token);
    }
    removeToken() {
        this.storage.remove(this.tokenName);
    }
    isAuthenticated() {
        var token = this.storage.get(this.tokenName);
        if (!token) {
            return false;
        }
        if (token.split('.').length !== 3) {
            return true;
        }
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var exp = JSON.parse(window.atob(base64)).exp;
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
            }
            else if (authUtils.isString(redirect)) {
                window.location.href = redirect;
            }
            resolve();
        });
    }
};
Authentication = __decorate([
    inject(Storage, BaseConfig), 
    __metadata('design:paramtypes', [Storage, BaseConfig])
], Authentication);
