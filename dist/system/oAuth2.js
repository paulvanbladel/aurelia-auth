'use strict';

System.register(['aurelia-dependency-injection', './auth-utilities', './storage', './popup', './base-config', './authentication', 'aurelia-fetch-client'], function (_export, _context) {
  "use strict";

  var inject, extend, forEach, isFunction, isString, joinUrl, camelCase, status, Storage, Popup, BaseConfig, Authentication, HttpClient, json, _dec, _class, OAuth2;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_authUtilities) {
      extend = _authUtilities.extend;
      forEach = _authUtilities.forEach;
      isFunction = _authUtilities.isFunction;
      isString = _authUtilities.isString;
      joinUrl = _authUtilities.joinUrl;
      camelCase = _authUtilities.camelCase;
      status = _authUtilities.status;
    }, function (_storage) {
      Storage = _storage.Storage;
    }, function (_popup) {
      Popup = _popup.Popup;
    }, function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }, function (_authentication) {
      Authentication = _authentication.Authentication;
    }, function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
      json = _aureliaFetchClient.json;
    }],
    execute: function () {
      _export('OAuth2', OAuth2 = (_dec = inject(Storage, Popup, HttpClient, BaseConfig, Authentication), _dec(_class = function () {
        function OAuth2(storage, popup, http, config, auth) {
          _classCallCheck(this, OAuth2);

          this.storage = storage;
          this.config = config.current;
          this.popup = popup;
          this.http = http;
          this.auth = auth;
          this.defaults = {
            url: null,
            name: null,
            state: null,
            scope: null,
            scopeDelimiter: null,
            redirectUri: null,
            popupOptions: null,
            authorizationEndpoint: null,
            responseParams: null,
            requiredUrlParams: null,
            optionalUrlParams: null,
            defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
            responseType: 'code'
          };
        }

        OAuth2.prototype.open = function open(options, userData) {
          var _this = this;

          var current = extend({}, this.defaults, options);

          var stateName = current.name + '_state';

          if (isFunction(current.state)) {
            this.storage.set(stateName, current.state());
          } else if (isString(current.state)) {
            this.storage.set(stateName, current.state);
          }

          var nonceName = current.name + '_nonce';

          if (isFunction(current.nonce)) {
            this.storage.set(nonceName, current.nonce());
          } else if (isString(current.nonce)) {
            this.storage.set(nonceName, current.nonce);
          }

          var url = current.authorizationEndpoint + '?' + this.buildQueryString(current);

          var openPopup = void 0;
          if (this.config.platform === 'mobile') {
            openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).eventListener(current.redirectUri);
          } else {
            openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).pollPopup();
          }

          return openPopup.then(function (oauthData) {
            if (oauthData.state && oauthData.state !== _this.storage.get(stateName)) {
              return Promise.reject('OAuth 2.0 state parameter mismatch.');
            }

            if (current.responseType.toUpperCase().indexOf('TOKEN') !== -1) {
              if (!_this.verifyIdToken(oauthData, current.name)) {
                return Promise.reject('OAuth 2.0 Nonce parameter mismatch.');
              }

              return oauthData;
            }

            return _this.exchangeForToken(oauthData, userData, current);
          });
        };

        OAuth2.prototype.verifyIdToken = function verifyIdToken(oauthData, providerName) {
          var idToken = oauthData && oauthData[this.config.responseIdTokenProp];
          if (!idToken) return true;
          var idTokenObject = this.auth.decomposeToken(idToken);
          if (!idTokenObject) return true;
          var nonceFromToken = idTokenObject.nonce;
          if (!nonceFromToken) return true;
          var nonceInStorage = this.storage.get(providerName + '_nonce');
          if (nonceFromToken !== nonceInStorage) {
            return false;
          }
          return true;
        };

        OAuth2.prototype.exchangeForToken = function exchangeForToken(oauthData, userData, current) {
          var data = extend({}, userData, {
            code: oauthData.code,
            clientId: current.clientId,
            redirectUri: current.redirectUri
          });

          if (oauthData.state) {
            data.state = oauthData.state;
          }

          forEach(current.responseParams, function (param) {
            return data[param] = oauthData[param];
          });

          var exchangeForTokenUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, current.url) : current.url;
          var credentials = this.config.withCredentials ? 'include' : 'same-origin';

          return this.http.fetch(exchangeForTokenUrl, {
            method: 'post',
            body: json(data),
            credentials: credentials
          }).then(status);
        };

        OAuth2.prototype.buildQueryString = function buildQueryString(current) {
          var _this2 = this;

          var keyValuePairs = [];
          var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

          forEach(urlParams, function (params) {
            forEach(current[params], function (paramName) {
              var camelizedName = camelCase(paramName);
              var paramValue = isFunction(current[paramName]) ? current[paramName]() : current[camelizedName];

              if (paramName === 'state') {
                var stateName = current.name + '_state';
                paramValue = encodeURIComponent(_this2.storage.get(stateName));
              }

              if (paramName === 'nonce') {
                var nonceName = current.name + '_nonce';
                paramValue = encodeURIComponent(_this2.storage.get(nonceName));
              }

              if (paramName === 'scope' && Array.isArray(paramValue)) {
                paramValue = paramValue.join(current.scopeDelimiter);

                if (current.scopePrefix) {
                  paramValue = [current.scopePrefix, paramValue].join(current.scopeDelimiter);
                }
              }

              keyValuePairs.push([paramName, paramValue]);
            });
          });

          return keyValuePairs.map(function (pair) {
            return pair.join('=');
          }).join('&');
        };

        return OAuth2;
      }()) || _class));

      _export('OAuth2', OAuth2);
    }
  };
});