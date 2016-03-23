import {inject} from 'aurelia-dependency-injection';
import {HttpClient} from 'aurelia-fetch-client';
import 'isomorphic-fetch';
import {Authentication} from './authentication';

@inject(HttpClient, Authentication )
export class FetchConfig {
    constructor(httpClient, authService) {
        this.httpClient = httpClient;
        this.auth = authService;
    }

    configure() {
        this.httpClient.configure(httpConfig => {
            httpConfig
                .withDefaults({
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .withInterceptor(this.auth.token_interceptor);
        });
    }
}
