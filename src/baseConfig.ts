import authUtils from './authUtils';
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
    postContentType?: string;//option form|json
    useRefreshToken?: boolean;
    refreshTokenRoot?:string | boolean;
    refreshTokenName?: string;
    refreshTokenPrefix?: string;
    loginUrl?: string;
    signupUrl?: string;
    profileUrl?: string;
    loginRoute?: string;
    signupRoute?: string;
    tokenRoot?: string|boolean;
    tokenName?: string;
    tokenPrefix?: string;
    unlinkUrl?: string;
    unlinkMethod?: string;
    authHeader?: string;
    authToken?: string;
    withCredentials?: boolean|string;
    platform?: string;
    storage?: string;
    providers?: Providers;
}

export class BaseConfig {
    _current: IBaseConfig;
    configure(incomingConfig: any) {
        authUtils.merge(this._current, incomingConfig);
    };

    get current() {
        return this._current;
    };

    constructor() {
        this._current = {
            httpInterceptor: true,
            loginOnSignup: true,
            baseUrl: '/',
            loginRedirect: '/#customer',
            logoutRedirect: '/',
            signupRedirect: '/login',
            loginUrl: '/auth/login',
            signupUrl: '/auth/signup',
            profileUrl: '/auth/me',
            loginRoute: '/login',
            signupRoute: '/signup',
            postContentType: 'json',//option form|json
            useRefreshToken: false,
            refreshTokenRoot: false,
            refreshTokenName: 'refresh_token',
            refreshTokenPrefix: 'aurelia',
            tokenRoot: false,
            tokenName: 'token',
            tokenPrefix: 'aurelia',
            unlinkUrl: '/auth/unlink/',
            unlinkMethod: 'get',
            authHeader: 'Authorization',
            authToken: 'Bearer',
            withCredentials: true,
            platform: 'browser',
            storage: 'localStorage',
            providers: {
                google: {
                    name: 'google',
                    url: '/auth/google',
                    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
                    redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                    scope: ['profile', 'email'],
                    scopePrefix: 'openid',
                    scopeDelimiter: ' ',
                    requiredUrlParams: ['scope'],
                    optionalUrlParams: ['display'],
                    display: 'popup',
                    type: '2.0',
                    /*clientId: '239531826023-ibk10mb9p7ull54j55a61og5lvnjrff6.apps.googleusercontent.com',*/
                    popupOptions: {
                        width: 452,
                        height: 633
                    }
                },
                facebook: {
                    name: 'facebook',
                    url: '/auth/facebook',
                    authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
                    redirectUri: window.location.origin + '/' || window.location.protocol + '//' + window.location.host + '/',
                    scope: ['email'],
                    scopeDelimiter: ',',
                    nonce: function() {
                        return Math.random();
                    },
                    requiredUrlParams: ['nonce', 'display', 'scope'],
                    display: 'popup',
                    type: '2.0',
                    popupOptions: {
                        width: 580,
                        height: 400
                    }
                },
                linkedin: {
                    name: 'linkedin',
                    url: '/auth/linkedin',
                    authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
                    redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                    requiredUrlParams: ['state'],
                    scope: ['r_emailaddress'],
                    scopeDelimiter: ' ',
                    state: 'STATE',
                    type: '2.0',
                    popupOptions: {
                        width: 527,
                        height: 582
                    }
                },
                github: {
                    name: 'github',
                    url: '/auth/github',
                    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
                    redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                    optionalUrlParams: ['scope'],
                    scope: ['user:email'],
                    scopeDelimiter: ' ',
                    type: '2.0',
                    popupOptions: {
                        width: 1020,
                        height: 618
                    }
                },
                yahoo: {
                    name: 'yahoo',
                    url: '/auth/yahoo',
                    authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
                    redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                    scope: [],
                    scopeDelimiter: ',',
                    type: '2.0',
                    popupOptions: {
                        width: 559,
                        height: 519
                    }
                },
                twitter: {
                    name: 'twitter',
                    url: '/auth/twitter',
                    authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
                    type: '1.0',
                    popupOptions: {
                        width: 495,
                        height: 645
                    }
                },
                live: {
                    name: 'live',
                    url: '/auth/live',
                    authorizationEndpoint: 'https://login.live.com/oauth20_authorize.srf',
                    redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                    scope: ['wl.emails'],
                    scopeDelimiter: ' ',
                    requiredUrlParams: ['display', 'scope'],
                    display: 'popup',
                    type: '2.0',
                    popupOptions: {
                        width: 500,
                        height: 560
                    }
                },
                instagram: {
                    name: 'instagram',
                    url: '/auth/instagram',
                    authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
                    redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                    requiredUrlParams: ['scope'],
                    scope: ['basic'],
                    scopeDelimiter: '+',
                    display: 'popup',
                    type: '2.0',
                    popupOptions: {
                        width: 550,
                        height: 369
                    }
                }
            }
        };

    }
}
