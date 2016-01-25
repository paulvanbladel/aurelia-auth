import {HttpClient} from 'aurelia-fetch-client'
import {Authentication} from './authentication';
import {BaseConfig, IBaseConfig} from './baseConfig'
import {inject} from 'aurelia-framework';
import {Storage} from './storage';

@inject(HttpClient, Authentication, Storage, BaseConfig)
export class FetchConfig {
  config: IBaseConfig;
  constructor(private httpClient:HttpClient,private auth:Authentication,private storage:Storage, config:BaseConfig) {
    this.config = config.current;
  }

  configure() {
    var auth = this.auth;
    var config = this.config;
    var storage = this.storage;

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
              var tokenName = config.tokenPrefix ? `${config.tokenPrefix}_${config.tokenName}` : config.tokenName;
              var token = storage.get(tokenName);

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