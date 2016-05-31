declare module 'aurelia-auth' {
  import {
    inject
  } from 'aurelia-dependency-injection';
  import {
    HttpClient,
    json
  } from 'aurelia-fetch-client';
  import {
    Redirect
  } from 'aurelia-router';
  import {
    EventAggregator
  } from 'aurelia-event-aggregator';
  export function status(response: any): any;
  export function isDefined(value: any): any;
  export function camelCase(name: any): any;
  export function parseQueryString(keyValue: any): any;
  export function isString(value: any): any;
  export function isObject(value: any): any;
  export function isFunction(value: any): any;
  export function joinUrl(baseUrl: any, url: any): any;
  export function isBlankObject(value: any): any;
  export function isArrayLike(obj: any): any;
  export function isWindow(obj: any): any;
  export function extend(dst: any): any;
  export function merge(dst: any): any;
  export function forEach(obj: any, iterator: any, context: any): any;
  export class AuthFilterValueConverter {
    toView(routes: any, isAuthenticated: any): any;
  }
  export class BaseConfig {
    configure(incomingConfig: any): any;
    current: any;
    constructor();
  }
  export class Popup {
    constructor(config: any);
    open(url: any, windowName: any, options: any, redirectUri: any): any;
    eventListener(redirectUri: any): any;
    pollPopup(): any;
    prepareOptions(options: any): any;
    stringifyOptions(options: any): any;
  }
  export class Storage {
    constructor(config: any);
    get(key: any): any;
    set(key: any, value: any): any;
    remove(key: any): any;
  }
  export class Authentication {
    constructor(storage: any, config: any);
    getLoginRoute(): any;
    getLoginRedirect(): any;
    getLoginUrl(): any;
    getSignupUrl(): any;
    getProfileUrl(): any;
    getToken(): any;
    getPayload(): any;
    decomposeToken(token: any): any;
    setInitialUrl(url: any): any;
    setToken(response: any, redirect: any): any;
    removeToken(): any;
    isAuthenticated(): any;
    logout(redirect: any): any;
    tokenInterceptor: any;
  }
  export class OAuth1 {
    constructor(storage: any, popup: any, http: any, config: any);
    open(options: any, userData: any): any;
    exchangeForToken(oauthData: any, userData: any, current: any): any;
    buildQueryString(obj: any): any;
  }
  export class FetchConfig {
    constructor(httpClient: any, authService: any);
    configure(): any;
  }
  export class AuthorizeStep {
    constructor(auth: any);
    run(routingContext: any, next: any): any;
  }
  export class OAuth2 {
    constructor(storage: any, popup: any, http: any, config: any, auth: any);
    open(options: any, userData: any): any;
    
    //responseType is authorization code only (no token nor id_token)
    verifyIdToken(oauthData: any, providerName: any): any;
    exchangeForToken(oauthData: any, userData: any, current: any): any;
    buildQueryString(current: any): any;
  }
  export class AuthService {
    constructor(http: any, auth: any, oAuth1: any, oAuth2: any, config: any, eventAggregator: any);
    getMe(): any;
    isAuthenticated(): any;
    getTokenPayload(): any;
    signup(displayName: any, email: any, password: any): any;
    login(email: any, password: any): any;
    logout(redirectUri: any): any;
    authenticate(name: any, redirect: any, userData: any): any;
    unlink(provider: any): any;
  }
}