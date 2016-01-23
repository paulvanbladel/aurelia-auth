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
import { HttpClient, json } from 'aurelia-fetch-client';
import { Authentication } from './authentication';
import { BaseConfig } from './baseConfig';
import { OAuth1 } from './oAuth1';
import { OAuth2 } from './oAuth2';
import authUtils from './authUtils';
export let AuthService = class {
    constructor(http, auth, oAuth1, oAuth2, config) {
        this.http = http;
        this.auth = auth;
        this.oAuth1 = oAuth1;
        this.oAuth2 = oAuth2;
        this.config = config.current;
    }
    getMe() {
        var profileUrl = this.auth.getProfileUrl();
        return this.http.fetch(profileUrl)
            .then(status)
            .then(toJson)
            .then((response) => {
            return response;
        });
    }
    isAuthenticated() {
        return this.auth.isAuthenticated();
    }
    getTokenPayload() {
        return this.auth.getPayload();
    }
    signup(displayName, email, password) {
        var signupUrl = this.auth.getSignupUrl();
        var content;
        if (typeof arguments[0] === 'object') {
            content = arguments[0];
        }
        else {
            content = {
                'displayName': displayName,
                'email': email,
                'password': password
            };
        }
        return this.http.fetch(signupUrl, {
            method: 'post',
            body: json(content)
        })
            .then(status)
            .then(toJson)
            .then((response) => {
            if (this.config.loginOnSignup) {
                this.auth.setToken(response);
            }
            else if (this.config.signupRedirect) {
                window.location.href = this.config.signupRedirect;
            }
            return response;
        });
    }
    login(email, password) {
        var loginUrl = this.auth.getLoginUrl();
        var content;
        if (typeof arguments[1] !== 'string') {
            content = arguments[0];
        }
        else {
            content = { 'email': email, 'password': password };
        }
        if (this.config.postContentType === 'json') {
            content = JSON.stringify(content);
        }
        else if (this.config.postContentType === 'form') {
            var data = [];
            for (var key in content) {
                data.push(key + "=" + content[key]);
            }
            content = data.join('&');
        }
        return this.http.fetch(loginUrl, {
            method: 'post',
            body: content
        })
            .then(status)
            .then(toJson)
            .then((response) => {
            if (this.config.useRefreshToken) {
                this.auth.setRefreshToken(response);
            }
            this.auth.setToken(response);
            return response;
        });
    }
    ;
    logout(redirectUri) {
        return this.auth.logout(redirectUri);
    }
    authenticate(name, redirect, userData) {
        var provider = this.oAuth2;
        if (this.config.providers[name].type === '1.0') {
            provider = this.oAuth1;
        }
        ;
        return provider.open(this.config.providers[name], userData || {})
            .then((response) => {
            this.auth.setToken(response, redirect);
            return response;
        });
    }
    unlink(provider) {
        var unlinkUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;
        if (this.config.unlinkMethod === 'get') {
            return this.http.fetch(unlinkUrl + provider)
                .then(status)
                .then(toJson)
                .then((response) => {
                return response;
            });
        }
        else if (this.config.unlinkMethod === 'post') {
            return this.http.fetch(unlinkUrl, {
                method: 'post',
                body: json(provider)
            })
                .then(status)
                .then(toJson)
                .then((response) => {
                return response;
            });
        }
    }
};
AuthService = __decorate([
    inject(HttpClient, Authentication, OAuth1, OAuth2, BaseConfig), 
    __metadata('design:paramtypes', [HttpClient, Authentication, OAuth1, OAuth2, BaseConfig])
], AuthService);
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
