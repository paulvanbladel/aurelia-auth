declare module 'aurelia-auth/authUtils' {
	 var authUtils: {
	    isDefined: (value: any) => boolean;
	    camelCase: (name: any) => any;
	    parseQueryString: (keyValue: any) => {};
	    isString: (value: any) => boolean;
	    isObject: (value: any) => boolean;
	    isArray: (arg: any) => arg is any[];
	    isFunction: (value: any) => boolean;
	    joinUrl: (baseUrl: any, url: any) => any;
	    isBlankObject: (value: any) => boolean;
	    isArrayLike: (obj: any) => boolean;
	    isWindow: (obj: any) => boolean;
	    extend: (dst: any) => any;
	    merge: (dst: any) => any;
	    forEach: (obj: any, iterator: any, context: any) => any;
	};
	export default authUtils;

}
declare module 'aurelia-auth/baseConfig' {
	export class BaseConfig {
	    configure(incomingConfig: any): void;
	    current: any;
	    constructor();
	}

}
declare module 'aurelia-auth/storage' {
	export class Storage {
	    constructor(config: any);
	    get(key: any): any;
	    set(key: any, value: any): void;
	    remove(key: any): void;
	}

}
declare module 'aurelia-auth/authentication' {
	export class Authentication {
	    constructor(storage: any, config: any);
	    getLoginRoute(): any;
	    getLoginRedirect(): any;
	    getLoginUrl(): any;
	    getSignupUrl(): any;
	    getProfileUrl(): any;
	    getToken(): any;
	    getPayload(): any;
	    setInitialUrl(url: any): void;
	    setToken(response: any, redirect: any): void;
	    removeToken(): void;
	    isAuthenticated(): boolean;
	    logout(redirect: any): any;
	}

}
declare module 'aurelia-auth/app.fetch-httpClient.config' {
	export class FetchConfig {
	    constructor(httpClient: any, authService: any, storage: any, config: any);
	    configure(): void;
	}

}
declare module 'aurelia-auth/app.httpClient.config' {
	export default class  {
	    constructor(http: any, auth: any, storage: any, config: any);
	    configure(): void;
	}

}
declare module 'aurelia-auth/authFilter' {
	export class AuthFilterValueConverter {
	    toView(routes: any, isAuthenticated: any): any;
	}

}
declare module 'aurelia-auth/popup' {
	export class Popup {
	    constructor(config: any);
	    open(url: any, windowName: any, options: any, redirectUri: any): this;
	    eventListener(redirectUri: any): any;
	    pollPopup(): any;
	    prepareOptions(options: any): any;
	    stringifyOptions(options: any): string;
	}

}
declare module 'aurelia-auth/oAuth1' {
	export class OAuth1 {
	    constructor(storage: any, popup: any, http: any, config: any);
	    open(options: any, userData: any): any;
	    exchangeForToken(oauthData: any, userData: any): any;
	    buildQueryString(obj: any): string;
	}

}
declare module 'aurelia-auth/oAuth2' {
	export class OAuth2 {
	    constructor(storage: any, popup: any, http: any, config: any);
	    open(options: any, userData: any): any;
	    exchangeForToken(oauthData: any, userData: any): any;
	    buildQueryString(): string;
	}

}
declare module 'aurelia-auth/authService' {
	export class AuthService {
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
	export class AuthorizeStep {
	    constructor(auth: any);
	    run(routingContext: any, next: any): any;
	}

}
declare module 'aurelia-auth/index' {
	export { AuthService } from 'aurelia-auth/authService';
	export { AuthorizeStep } from 'aurelia-auth/authorizeStep';
	export { FetchConfig } from 'aurelia-auth/app.fetch-httpClient.config';
	export function configure(aurelia: any, configCallback: any): void;

}
