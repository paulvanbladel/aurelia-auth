import {inject} from 'aurelia-dependency-injection';
import {HttpClient, json} from 'aurelia-fetch-client';
import 'isomorphic-fetch';
import {Authentication} from './authentication';
import {BaseConfig} from './baseConfig';
import {OAuth1} from './oAuth1';
import {OAuth2} from './oAuth2';
import authUtils from './authUtils';


@inject(HttpClient,Authentication, OAuth1, OAuth2, BaseConfig)
export class AuthService {
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
      .then(authUtils.status)
      .then((response) => {
        return response
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
    } else {
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
      .then(authUtils.status)
      .then((response) => {
        if (this.config.loginOnSignup) {
          this.auth.setToken(response);
        } else if (this.config.signupRedirect) {
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
    } else {
      content = {
        'email': email,
        'password': password
      };
    }

    return this.http.fetch(loginUrl, {
      method: 'post',
      headers: typeof(content)==='string' ? {'Content-Type': 'application/x-www-form-urlencoded'} : {},
      body: typeof(content)==='string' ? content : json(content)
    })
      .then(authUtils.status)
      .then((response) => {
        this.auth.setToken(response)
        return response
      });
  }

  logout(redirectUri) {
    return this.auth.logout(redirectUri);
  }

  authenticate(name, redirect, userData) {
    var provider = this.oAuth2;
    if (this.config.providers[name].type === '1.0') {
      provider = this.oAuth1;
    };

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
        .then(authUtils.status)
        .then((response) => {
          return response;
        });
    } else if (this.config.unlinkMethod === 'post') {
      return this.http.fetch(unlinkUrl, {
        method: 'post',
        body: json(provider)
      })
        .then(authUtils.status)
        .then((response) => {
          return response;
        });
    }
  }
}


