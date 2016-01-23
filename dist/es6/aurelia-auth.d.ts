declare module 'aurelia-auth/authUtils' {
	 var authUtils: {
	    isDefined: (value: any) => boolean;
	    camelCase: (name: any) => any;
	    parseQueryString: (keyValue: any) => any;
	    isString: (value: any) => boolean;
	    isObject: (value: any) => boolean;
	    isArray: (arg: any) => arg is any[];
	    isFunction: (value: any) => boolean;
	    joinUrl: (baseUrl: any, url: any) => any;
	    isBlankObject: (value: any) => boolean;
	    isArrayLike: (obj: any) => boolean;
	    isWindow: (obj: any) => boolean;
	    extend: (dst: any, ...args: any[]) => any;
	    merge: (dst: any, ...args: any[]) => any;
	    forEach: (obj: any, iterator: any, context?: any) => any;
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
	    httpInterceptor?: boolean;
	    loginOnSignup?: boolean;
	    baseUrl?: string;
	    clientId?: string;
	    loginRedirect?: string;
	    logoutRedirect?: string;
	    signupRedirect?: string;
	    postContentType?: string;
	    useRefreshToken?: boolean;
	    refreshTokenRoot?: string | boolean;
	    refreshTokenName?: string;
	    refreshTokenPrefix?: string;
	    loginUrl?: string;
	    signupUrl?: string;
	    profileUrl?: string;
	    loginRoute?: string;
	    signupRoute?: string;
	    tokenRoot?: string | boolean;
	    tokenName?: string;
	    tokenPrefix?: string;
	    unlinkUrl?: string;
	    unlinkMethod?: string;
	    authHeader?: string;
	    authToken?: string;
	    withCredentials?: boolean | string;
	    platform?: string;
	    storage?: string;
	    providers?: Providers;
	}
	export class BaseConfig {
	    _current: IBaseConfig;
	    configure(incomingConfig: any): void;
	    current: IBaseConfig;
	    constructor();
	}

}
declare module 'aurelia-auth/storage' {
	import { IBaseConfig } from 'aurelia-auth/baseConfig';
	export class Storage {
	    config: IBaseConfig;
	    constructor(config: any);
	    get(key: any): any;
	    set(key: any, value: any): void;
	    remove(key: any): void;
	}

}
declare module 'aurelia-auth/authentication' {
	import { BaseConfig, IBaseConfig } from 'aurelia-auth/baseConfig';
	import { Storage } from 'aurelia-auth/storage';
	export class Authentication {
	    private storage;
	    config: IBaseConfig;
	    tokenName: string;
	    refreshTokenName: string;
	    constructor(storage: Storage, config: BaseConfig);
	    getLoginRoute(): string;
	    getLoginRedirect(): string;
	    getLoginUrl(): any;
	    getSignupUrl(): any;
	    getProfileUrl(): any;
	    getToken(): any;
	    getRefreshToken(): any;
	    getPayload(): any;
	    setToken(response: any, redirect?: string): void;
	    setRefreshToken(response: any): void;
	    removeToken(): void;
	    isAuthenticated(): boolean;
	    logout(redirect: any): any;
	}

}
declare module 'aurelia-auth/app.fetch-httpClient.config' {
	import { HttpClient } from 'aurelia-fetch-client';
	import { Authentication } from 'aurelia-auth/authentication';
	import { BaseConfig, IBaseConfig } from 'aurelia-auth/baseConfig';
	import { Storage } from 'aurelia-auth/storage';
	export class FetchConfig {
	    private httpClient;
	    private auth;
	    private storage;
	    config: IBaseConfig;
	    constructor(httpClient: HttpClient, auth: Authentication, storage: Storage, config: BaseConfig);
	    configure(): void;
	}

}
declare module 'aurelia-auth/app.httpClient.config' {
	import { HttpClient } from 'aurelia-http-client';
	import { BaseConfig, IBaseConfig } from 'aurelia-auth/baseConfig';
	import { Authentication } from 'aurelia-auth/authentication';
	import { Storage } from 'aurelia-auth/storage';
	export default class  {
	    private http;
	    private auth;
	    private storage;
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
declare module 'aurelia-auth/OAuth2' {
	import { Storage } from 'aurelia-auth/storage';
	import { Popup } from 'aurelia-auth/popup';
	import { BaseConfig, IBaseConfig } from 'aurelia-auth/baseConfig';
	import { HttpClient } from 'aurelia-fetch-client';
	export class OAuth2 {
	    private storage;
	    private popup;
	    private http;
	    config: IBaseConfig;
	    defaults: IOAuthDefaults;
	    constructor(storage: Storage, popup: Popup, http: HttpClient, config: BaseConfig);
	    open(options: any, userData: any): any;
	    exchangeForToken(oauthData: any, userData: any): any;
	    buildQueryString(): string;
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

}
declare module 'aurelia-auth/oAuth1' {
	import { Storage } from 'aurelia-auth/storage';
	import { Popup } from 'aurelia-auth/popup';
	import { BaseConfig, IBaseConfig } from 'aurelia-auth/baseConfig';
	import { HttpClient } from 'aurelia-fetch-client';
	import { IOAuthDefaults } from 'aurelia-auth/OAuth2';
	export class OAuth1 {
	    private storage;
	    private popup;
	    private http;
	    defaults: IOAuthDefaults;
	    config: IBaseConfig;
	    constructor(storage: Storage, popup: Popup, http: HttpClient, config: BaseConfig);
	    open(options: any, userData: any): any;
	    exchangeForToken(oauthData: any, userData: any): any;
	    buildQueryString(obj: any): string;
	}

}
declare module 'aurelia-auth/authService' {
	import { HttpClient } from 'aurelia-fetch-client';
	import { Authentication } from 'aurelia-auth/authentication';
	import { BaseConfig, IBaseConfig } from 'aurelia-auth/baseConfig';
	import { OAuth1 } from 'aurelia-auth/oAuth1';
	import { OAuth2 } from 'aurelia-auth/oAuth2';
	export class AuthService {
	    private http;
	    private auth;
	    private oAuth1;
	    private oAuth2;
	    config: IBaseConfig;
	    constructor(http: HttpClient, auth: Authentication, oAuth1: OAuth1, oAuth2: OAuth2, config: BaseConfig);
	    getMe(): any;
	    isAuthenticated(): boolean;
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
	    private auth;
	    constructor(auth: Authentication);
	    run(routingContext: any, next: any): any;
	}

}
declare module 'aurelia-auth/index' {
	export { AuthService } from 'aurelia-auth/authService';
	export { AuthorizeStep } from 'aurelia-auth/authorizeStep';
	export { FetchConfig } from 'aurelia-auth/app.fetch-httpClient.config';
	export function configure(aurelia: any, configCallback: any): void;

}
declare module 'aurelia-auth' {
	import main = require('aurelia-auth/index');
	export = main;
}
