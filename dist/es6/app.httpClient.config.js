var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient, RequestBuilder } from 'aurelia-http-client';
import { BaseConfig } from './baseConfig';
import { Authentication } from './authentication';
import { Storage } from './storage';
import { inject } from 'aurelia-framework';
let default_1 = class {
    constructor(http, auth, storage, config) {
        this.http = http;
        this.auth = auth;
        this.storage = storage;
        this.config = config.current;
    }
    configure() {
        RequestBuilder.addHelper('authTokenHandling', () => {
            return (client, processor, message) => {
                if (this.auth.isAuthenticated() && this.config.httpInterceptor) {
                    var tokenName = (this.config.tokenPrefix ? `${this.config.tokenPrefix}_` : '') + this.config.tokenName;
                    var token = this.storage.get(tokenName);
                    if (this.config.authHeader && this.config.authToken) {
                        token = `${this.config.authToken} ${token}`;
                    }
                    message.headers.add(this.config.authHeader, token);
                }
            };
        });
        this.http.configure(x => {
            x.authTokenHandling();
            x.withHeader('Accept', 'application/json');
        });
    }
};
default_1 = __decorate([
    inject(HttpClient, Authentication, Storage, BaseConfig), 
    __metadata('design:paramtypes', [HttpClient, Authentication, Storage, BaseConfig])
], default_1);
export default default_1;
