import {HttpClient} from 'aurelia-fetch-client';
import {Authentication} from './authentication';
import {BaseConfig} from './baseConfig';
import {inject} from 'aurelia-dependency-injection';
import {Storage} from './storage';
import 'isomorphic-fetch';

@inject(HttpClient, Authentication, Storage, BaseConfig)
export class FetchConfig {
  constructor(httpClient, authService, storage, config) {
    this.httpClient = httpClient;
    this.auth = authService;
    this.storage = storage;
    this.config = config.current;
  }

  configure() {
    let auth = this.auth;
    let config = this.config;
    let storage = this.storage;

    this.httpClient.configure(httpConfig => {
      httpConfig
        .withDefaults({
          headers: {
            'Accept': 'application/json'
          }
        })
        .withInterceptor({
          request(request) {
            if (auth.isAuthenticated() && config.httpInterceptor) {
              let tokenName = config.tokenPrefix ? `${config.tokenPrefix}_${config.tokenName}` : config.tokenName;
              let token = storage.get(tokenName);

              if (config.authHeader && config.authToken) {
                token = `${config.authToken} ${token}`;
              }

              request.headers.append(config.authHeader, token);
            }

            return request;
          }
        });
    });
  }
}
