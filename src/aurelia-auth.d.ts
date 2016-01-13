declare module 'aurelia-auth/authUtils' {
	 var authUtils: {
	    isDefined(value: any): boolean;
	    camelCase(name: any): any;
	    parseQueryString(keyValue: any): any;
	    isString(value: any): boolean;
	    isObject(value: any): boolean;
	    isArray: (arg: any) => arg is any[];
	    isFunction(value: any): boolean;
	    joinUrl(baseUrl: any, url: any): any;
	    isBlankObject(value: any): boolean;
	    isArrayLike(obj: any): boolean;
	    isWindow(obj: any): boolean;
	    extend(dst: any, ...input: any[]): any;
	    merge(dst: any, ...input: any[]): any;
	    forEach(obj: any, iterator: any, context?: any): any;
	};
	export default authUtils;

}
declare module 'aurelia-auth/baseConfig' {
	export interface PopupOptions {
	    width: number;
	    height: number;
	}
	export interface Google {
	    name: string;
	    url: string;
	    authorizationEndpoint: string;
	    redirectUri: string;
	    scope: string[];
	    scopePrefix: string;
	    scopeDelimiter: string;
	    requiredUrlParams: string[];
	    optionalUrlParams: string[];
	    display: string;
	    type: string;
	    popupOptions: PopupOptions;
	}
	export interface PopupOptions2 {
	    width: number;
	    height: number;
	}
	export interface Facebook {
	    name: string;
	    url: string;
	    authorizationEndpoint: string;
	    redirectUri: string;
	    scope: string[];
	    nonce: Function;
	    scopeDelimiter: string;
	    requiredUrlParams: string[];
	    display: string;
	    type: string;
	    popupOptions: PopupOptions2;
	}
	export interface PopupOptions3 {
	    width: number;
	    height: number;
	}
	export interface Linkedin {
	    name: string;
	    url: string;
	    authorizationEndpoint: string;
	    redirectUri: string;
	    requiredUrlParams: string[];
	    scope: string[];
	    scopeDelimiter: string;
	    state: string;
	    type: string;
	    popupOptions: PopupOptions3;
	}
	export interface PopupOptions4 {
	    width: number;
	    height: number;
	}
	export interface Github {
	    name: string;
	    url: string;
	    authorizationEndpoint: string;
	    redirectUri: string;
	    optionalUrlParams: string[];
	    scope: string[];
	    scopeDelimiter: string;
	    type: string;
	    popupOptions: PopupOptions4;
	}
	export interface PopupOptions5 {
	    width: number;
	    height: number;
	}
	export interface Yahoo {
	    name: string;
	    url: string;
	    authorizationEndpoint: string;
	    redirectUri: string;
	    scope: any[];
	    scopeDelimiter: string;
	    type: string;
	    popupOptions: PopupOptions5;
	}
	export interface PopupOptions6 {
	    width: number;
	    height: number;
	}
	export interface Twitter {
	    name: string;
	    url: string;
	    authorizationEndpoint: string;
	    type: string;
	    popupOptions: PopupOptions6;
	}
	export interface PopupOptions7 {
	    width: number;
	    height: number;
	}
	export interface Live {
	    name: string;
	    url: string;
	    authorizationEndpoint: string;
	    redirectUri: string;
	    scope: string[];
	    scopeDelimiter: string;
	    requiredUrlParams: string[];
	    display: string;
	    type: string;
	    popupOptions: PopupOptions7;
	}
	export interface PopupOptions8 {
	    width: number;
	    height: number;
	}
	export interface Instagram {
	    name: string;
	    url: string;
	    authorizationEndpoint: string;
	    redirectUri: string;
	    requiredUrlParams: string[];
	    scope: string[];
	    scopeDelimiter: string;
	    display: string;
	    type: string;
	    popupOptions: PopupOptions8;
	}
	export interface Providers {
	    google: Google;
	    facebook: Facebook;
	    linkedin: Linkedin;
	    github: Github;
	    yahoo: Yahoo;
	    twitter: Twitter;
	    live: Live;
	    instagram: Instagram;
	}
	export interface IBaseConfig {
	    httpInterceptor: boolean;
	    loginOnSignup: boolean;
	    baseUrl: string;
	    loginRedirect: string;
	    logoutRedirect: string;
	    signupRedirect: string;
	    loginUrl: string;
	    signupUrl: string;
	    profileUrl: string;
	    loginRoute: string;
	    signupRoute: string;
	    tokenRoot: boolean;
	    tokenName: string;
	    tokenPrefix: string;
	    unlinkUrl: string;
	    unlinkMethod: string;
	    authHeader: string;
	    authToken: string;
	    withCredentials: boolean;
	    platform: string;
	    storage: string;
	    providers: Providers;
	}
	export class BaseConfig {
	    _current: IBaseConfig;
	    configure(incomingConfig: any): void;
	    current: IBaseConfig;
	    constructor();
	}

}
declare module 'aurelia-auth/storage' {
	import { BaseConfig, IBaseConfig } from 'aurelia-auth/baseConfig';
	export class Storage {
	    config: IBaseConfig;
	    constructor(config: BaseConfig);
	    get(key: any): any;
	    set(key: any, value: any): void;
	    remove(key: any): void;
	}

}
declare module 'aurelia-auth/authentication' {
	export class Authentication {
	    storage: any;
	    config: any;
	    tokenName: any;
	    constructor(storage: any, config: any);
	    getLoginRoute(): any;
	    getLoginRedirect(): any;
	    getLoginUrl(): any;
	    getSignupUrl(): any;
	    getProfileUrl(): any;
	    getToken(): any;
	    getPayload(): any;
	    setToken(response: any, redirect: any): void;
	    removeToken(): void;
	    isAuthenticated(): boolean;
	    logout(redirect: any): any;
	}

}
declare module 'aurelia-auth/app.fetch-httpClient.config' {
	/// <reference path="baseConfig.d.ts" />
	import { HttpClient } from 'aurelia-fetch-client';
	import { Authentication } from 'aurelia-auth/authentication';
	import { BaseConfig, IBaseConfig } from 'aurelia-auth/baseConfig';
	import { Storage } from 'aurelia-auth/storage';
	export class FetchConfig {
	    httpClient: HttpClient;
	    auth: Authentication;
	    storage: Storage;
	    config:IBaseConfig;
	    constructor(httpClient: HttpClient, authService: Authentication, storage: Storage, config: BaseConfig);
	    configure(): void;
	}

}
declare module 'aurelia-auth/app.httpClient.config' {
	import { HttpClient } from 'aurelia-http-client';
	import { BaseConfig } from 'aurelia-auth/baseConfig';
	import { Authentication } from 'aurelia-auth/authentication';
	import { Storage } from 'aurelia-auth/storage';
	export default class HttpCilentConfig {
	    http: HttpClient;
	    auth: Authentication;
	    storage: Storage;
	    config: IBaseConfig;
	    constructor(http: HttpClient, auth: Authentication, storage: Storage, config: BaseConfig);
	    configure(): void;
	}

}
declare module 'aurelia-auth/authFilter' {
	export class AuthFilterValueConverter {
	    toView(routes: any, isAuthenticated: any): any;
	}

}
declare module 'aurelia-auth/popup' {
	import { BaseConfig, IBaseConfig } from 'aurelia-auth/baseConfig';
	
	export class Popup {
	    config: IBaseConfig;
	    popupWindow: any;
	    polling: any;
	    url: string;
	    constructor(config: BaseConfig);
	    open(url: any, windowName: any, options: any, redirectUri: any): this;
	    eventListener(redirectUri: any): any;
	    pollPopup(): any;
	    prepareOptions(options: any): any;
	    stringifyOptions(options: any): string;
	}

}
declare module 'aurelia-auth/oAuth1' {
	import { Storage } from 'aurelia-auth/storage';
	import { Popup } from 'aurelia-auth/popup';
	import { HttpClient } from "aurelia-http-client";
	export class OAuth1 {
	    storage: Storage;
	    config: any;
	    popup: Popup;
	    http: HttpClient;
	    defaults: any;
	    constructor(storage: any, popup: any, http: any, config: any);
	    private open(options, userData);
	    private exchangeForToken(oauthData, userData);
	    buildQueryString(obj: any): string;
	}

}
declare module 'aurelia-auth/oAuth2' {
	import { Storage } from 'aurelia-auth/storage';
	import { Popup } from 'aurelia-auth/popup';
	import { BaseConfig, IBaseConfig } from 'aurelia-auth/baseConfig';
	import { HttpClient } from "aurelia-http-client";
	export class OAuth2 {
	    storage: Storage;
	    config: BaseConfig;
	    popup: Popup;
	    http: HttpClient;
	    defaults: IDefaults;
	    constructor(storage: Storage, popup: Popup, http: HttpClient, config: BaseConfig);
	    open(options: any, userData: any): any;
	    private exchangeForToken(oauthData, userData);
	    buildQueryString(): string;
	}
	export interface IDefaults {
	    url?: any;
	    name?: any;
	    state?: any;
	    scope?: any;
	    scopeDelimiter?: any;
	    redirectUri?: any;
	    popupOptions?: any;
	    authorizationEndpoint?: any;
	    responseParams?: any;
	    requiredUrlParams?: any;
	    optionalUrlParams?: any;
	    defaultUrlParams: string[];
	    responseType: string;
	    clientId?: string;
	    scopePrefix?: string;
	}

}
declare module 'aurelia-auth/authService' {
	export class AuthService {
	    http: any;
	    auth: any;
	    oAuth1: any;
	    oAuth2: any;
	    config: any;
	    constructor(http: any, auth: any, oAuth1: any, oAuth2: any, config: any);
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
declare module 'aurelia-auth/authorizeStep' {
	import { Authentication } from 'aurelia-auth/authentication';
	export class AuthorizeStep {
	    constructor(auth: Authentication);
	    run(routingContext: any, next: any): any;
	    auth: Authentication;
	}

}
declare module 'aurelia-auth' {
	export { AuthService } from 'aurelia-auth/authService';
	export { AuthorizeStep } from 'aurelia-auth/authorizeStep';
	export { FetchConfig } from 'aurelia-auth/app.fetch-httpClient.config';
	export function configure(aurelia: any, configCallback: any): void;

}
