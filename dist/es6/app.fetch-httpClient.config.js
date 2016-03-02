import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {Authentication} from './authentication';
import {BaseConfig} from './baseConfig';
import {inject} from 'aurelia-dependency-injection';
import {Storage} from './storage';

@inject(HttpClient, Authentication, Storage, BaseConfig)
export class FetchConfig {
  constructor(httpClient, authService, storage, config) {
    this.httpClient = httpClient;
    this.auth = authService;
    this.storage = storage;
    this.config = config.current;
  }

  configure() {
    this.httpClient.configure(httpConfig => {
      httpConfig
        .withDefaults({
          headers: {
            'Accept': 'application/json'
          }
        })
        .withInterceptor({
          request: (request) => {
            if (this.auth.isAuthenticated() && this.config.httpInterceptor) {
              let token = this.auth.token;
              if (this.config.authHeader && this.config.authToken) {
                token = `${this.config.authToken} ${this.auth.token}`;
              }
              request.headers.append(this.config.authHeader, token);
            }
            return request;
          }
        });
    });
  }
}
