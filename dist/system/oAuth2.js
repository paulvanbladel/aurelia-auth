System.register(['aurelia-dependency-injection', './authUtils', './storage', './popup', './baseConfig', './authentication', 'aurelia-fetch-client', 'fetch'], function (_export) {
  'use strict';

  var inject, authUtils, Storage, Popup, BaseConfig, Authentication, HttpClient, json, OAuth2;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_authUtils) {
      authUtils = _authUtils['default'];
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
    }, function (_fetch) {}],
    execute: function () {
      OAuth2 = (function () {
        function OAuth2(storage, popup, http, config, auth) {
          _classCallCheck(this, _OAuth2);

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

        _createClass(OAuth2, [{
          key: 'open',
          value: function open(options, userData) {
            var _this = this;

            var current = authUtils.extend({}, this.defaults, options);

            var stateName = current.name + '_state';

            if (authUtils.isFunction(current.state)) {
              this.storage.set(stateName, current.state());
            } else if (authUtils.isString(current.state)) {
              this.storage.set(stateName, current.state);
            }

            var nonceName = current.name + '_nonce';

            if (authUtils.isFunction(current.nonce)) {
              this.storage.set(nonceName, current.nonce());
            } else if (authUtils.isString(current.nonce)) {
              this.storage.set(nonceName, current.nonce);
            }

            var url = current.authorizationEndpoint + '?' + this.buildQueryString(current);

            var openPopup = undefined;
            if (this.config.platform === 'mobile') {
              openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).eventListener(current.redirectUri);
            } else {
              openPopup = this.popup.open(url, current.name, current.popupOptions, current.redirectUri).pollPopup();
            }

            return openPopup.then(function (oauthData) {
              if (oauthData.state && oauthData.state !== _this.storage.get(stateName)) {
                return Promise.reject('OAuth 2.0 state parameter mismatch.');
              }

              if (current.responseType.toUpperCase().includes('TOKEN')) {
                if (!_this.verifyIdToken(oauthData, current.name)) {
                  return Promise.reject('OAuth 2.0 Nonce parameter mismatch.');
                };
                return oauthData;
              }

              return _this.exchangeForToken(oauthData, userData, current);
            });
          }
        }, {
          key: 'verifyIdToken',
          value: function verifyIdToken(oauthData, providerName) {

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
          }
        }, {
          key: 'exchangeForToken',
          value: function exchangeForToken(oauthData, userData, current) {
            var data = authUtils.extend({}, userData, {
              code: oauthData.code,
              clientId: current.clientId,
              redirectUri: current.redirectUri
            });

            if (oauthData.state) {
              data.state = oauthData.state;
            }

            authUtils.forEach(current.responseParams, function (param) {
              return data[param] = oauthData[param];
            });

            var exchangeForTokenUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, current.url) : current.url;
            var credentials = this.config.withCredentials ? 'include' : 'same-origin';

            return this.http.fetch(exchangeForTokenUrl, {
              method: 'post',
              body: json(data),
              credentials: credentials
            }).then(authUtils.status).then(function (response) {
              return response;
            });
          }
        }, {
          key: 'buildQueryString',
          value: function buildQueryString(current) {
            var _this2 = this;

            var keyValuePairs = [];
            var urlParams = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];

            authUtils.forEach(urlParams, function (params) {
              authUtils.forEach(current[params], function (paramName) {
                var camelizedName = authUtils.camelCase(paramName);
                var paramValue = authUtils.isFunction(current[paramName]) ? current[paramName]() : current[camelizedName];

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
          }
        }]);

        var _OAuth2 = OAuth2;
        OAuth2 = inject(Storage, Popup, HttpClient, BaseConfig, Authentication)(OAuth2) || OAuth2;
        return OAuth2;
      })();

      _export('OAuth2', OAuth2);
    }
  };
});