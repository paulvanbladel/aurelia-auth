var _dec, _class;

import { inject } from 'aurelia-dependency-injection';
import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Authentication } from './authentication';
import { BaseConfig } from './base-config';
import { OAuth1 } from './oAuth1';
import { OAuth2 } from './oAuth2';
import { status, joinUrl } from './auth-utilities';

export let AuthService = (_dec = inject(HttpClient, Authentication, OAuth1, OAuth2, BaseConfig, EventAggregator), _dec(_class = class AuthService {
  constructor(http, auth, oAuth1, oAuth2, config, eventAggregator) {
    this.http = http;
    this.auth = auth;
    this.oAuth1 = oAuth1;
    this.oAuth2 = oAuth2;
    this.config = config.current;
    this.tokenInterceptor = auth.tokenInterceptor;
    this.eventAggregator = eventAggregator;
  }

  getMe() {
    let profileUrl = this.auth.getProfileUrl();
    return this.http.fetch(profileUrl).then(status);
  }

  isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  getTokenPayload() {
    return this.auth.getPayload();
  }

  signup(displayName, email, password) {
    let signupUrl = this.auth.getSignupUrl();
    let content;
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
    }).then(status).then(response => {
      if (this.config.loginOnSignup) {
        this.auth.setToken(response);
      } else if (this.config.signupRedirect) {
        window.location.href = this.config.signupRedirect;
      }
      this.eventAggregator.publish('auth:signup', response);
      return response;
    });
  }

  login(email, password) {
    let loginUrl = this.auth.getLoginUrl();
    let content;
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
      headers: typeof content === 'string' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {},
      body: typeof content === 'string' ? content : json(content)
    }).then(status).then(response => {
      this.auth.setToken(response);
      this.eventAggregator.publish('auth:login', response);
      return response;
    });
  }

  logout(redirectUri) {
    this.eventAggregator.publish('auth:logout');
    return this.auth.logout(redirectUri);
  }

  authenticate(name, redirect, userData) {
    let provider = this.oAuth2;
    if (this.config.providers[name].type === '1.0') {
      provider = this.oAuth1;
    }

    return provider.open(this.config.providers[name], userData || {}).then(response => {
      this.auth.setToken(response, redirect);
      this.eventAggregator.publish('auth:authenticate', response);
      return response;
    });
  }

  unlink(provider) {
    let unlinkUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

    if (this.config.unlinkMethod === 'get') {
      return this.http.fetch(unlinkUrl + provider).then(status).then(response => {
        this.eventAggregator.publish('auth:unlink', response);
        return response;
      });
    } else if (this.config.unlinkMethod === 'post') {
      return this.http.fetch(unlinkUrl, {
        method: 'post',
        body: json(provider)
      }).then(status).then(response => {
        this.eventAggregator.publish('auth:unlink', response);
        return response;
      });
    }
  }
}) || _class);