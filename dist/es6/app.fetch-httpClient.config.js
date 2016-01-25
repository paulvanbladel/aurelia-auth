var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from 'aurelia-fetch-client';
import { Authentication } from './authentication';
import { BaseConfig } from './baseConfig';
import { inject } from 'aurelia-framework';
import { Storage } from './storage';
export let FetchConfig = class {
    constructor(httpClient, auth, storage, config) {
        this.httpClient = httpClient;
        this.auth = auth;
        this.storage = storage;
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
};
FetchConfig = __decorate([
    inject(HttpClient, Authentication, Storage, BaseConfig), 
    __metadata('design:paramtypes', [HttpClient, Authentication, Storage, BaseConfig])
], FetchConfig);
