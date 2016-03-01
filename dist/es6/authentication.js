import {inject} from 'aurelia-dependency-injection';
import {BaseConfig}  from './baseConfig';
import {Storage} from './storage';
import authUtils from './authUtils';

@inject(Storage, BaseConfig)
export class Authentication {
  constructor(storage, config) {
    this.storage = storage;
    this.config = config.current;
    this.tokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
    this.idTokenName = this.config.tokenPrefix ? this.config.tokenPrefix + '_' + this.config.idTokenName : this.config.idTokenName;
    this.token = storage.get(this.tokenName);
  }

  getLoginRoute() {
    return this.config.loginRoute;
  }

  getLoginRedirect() {
    return this.initialUrl || this.config.loginRedirect;
  }

  getRequiredRoles() {
    return this.requiredRoles || [];
  }

  getLoginUrl() {
    return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.loginUrl) : this.config.loginUrl;
  }

  getSignupUrl() {
    return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.signupUrl) : this.config.signupUrl;
  }

  getProfileUrl() {
    return this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.profileUrl) : this.config.profileUrl;
  }

  getToken() {
    return this.token;
  }

  getPayload() {
    if (this.token && this.token.split('.').length === 3) {
      let base64Url = this.token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      try {
        return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
      } catch (error) {
        return null;
      }
    }
  }

  setInitialUrl(url, roles) {
    this.initialUrl = url;
    this.requiredRoles = roles;
  }

  setToken(response, redirect) {
    //access token handling
    let accessToken = response && response[this.config.responseTokenProp];
    let tokenToStore;

    if (accessToken) {
      if (authUtils.isObject(accessToken) && authUtils.isObject(accessToken.data)) {
        response = accessToken;
      } else if (authUtils.isString(accessToken)) {
        tokenToStore = accessToken;
      }
    }

    if (!tokenToStore && response) {
      tokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.tokenName] : response[this.config.tokenName];
    }

    if (tokenToStore) {
      this.token = tokenToStore;
      this.storage.set(this.tokenName, tokenToStore);
    }


    //id token handling

    let idToken = response && response[this.config.responseIdTokenProp];
    let idTokenToStore;

    if (idToken) {
      if (authUtils.isObject(idToken) && authUtils.isObject(idToken.data)) {
        response = idToken;
      } else if (authUtils.isString(idToken)) {
        idTokenToStore = idToken;
      }
    }

    if (!idTokenToStore && response) {
      idTokenToStore = this.config.tokenRoot && response[this.config.tokenRoot] ? response[this.config.tokenRoot][this.config.idTokenName] : response[this.config.IdTokenName];
    }

    if (idTokenToStore) {
      this.storage.set(this.idTokenName, idTokenToStore);
    }


    if (this.config.loginRedirect && !redirect) {
      window.location.href = this.getLoginRedirect();
    } else if (redirect && authUtils.isString(redirect)) {
      window.location.href = window.encodeURI(redirect);
    }
  }

  removeToken() {
    this.token = undefined;
    this.storage.remove(this.tokenName);
  }

  /**
   * Checks if user is authenticated.
   * If @auth is provided, also validates if user has at least one of the required roles.
   *
   * @param auth - it is string[] with roles names as elements
   */
  isAuthenticated(auth) {
    // There's no token, so user is not authenticated.
    if (!this.token) {
      return false;
    }

    // There is a token, but in a different format.
    if (this.token.split('.').length !== 3) {
      return authUtils.isArray(auth) ? auth.length === 0 : true; //if the roles are required then the token needs to be in good format
    }
    let payload = this.getPayload();
    if (!payload) {
      return false;
    }
    if (payload.exp && Math.round(new Date().getTime() / 1000) > payload.exp) {
      return false;
    }
    if (authUtils.isArray(auth) && auth.length > 0) {
      if (!payload.sub.roles) {
        return false;
      }
      return auth.some(r => payload.sub.roles.some(rp => r === rp));
    }
    return true;
  }

  isAuthorised(auth) {
    if (!auth || (authUtils.isArray(auth) && auth.length === 0)) {
      return true;
    }
    return this.isAuthenticated(auth);
  }

  logout(redirect) {
    return new Promise(resolve => {
      this.removeToken();
      if (this.config.logoutRedirect && !redirect) {
        window.location.href = this.config.logoutRedirect;
      } else if (authUtils.isString(redirect)) {
        window.location.href = redirect;
      }

      resolve();
    });
  }
}
