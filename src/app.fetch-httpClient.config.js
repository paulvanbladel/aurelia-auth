import {HttpClient} from 'aurelia-fetch-client';
import 'isomorphic-fetch';
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


    get intereceptor() {
        return {
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
        }
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
                .withInterceptor(this.intereceptor);
        });
    }
}
