var _dec, _class;

import { inject } from 'aurelia-dependency-injection';
import { HttpClient } from 'aurelia-fetch-client';
import { Authentication } from './authentication';

export let FetchConfig = (_dec = inject(HttpClient, Authentication), _dec(_class = class FetchConfig {
  constructor(httpClient, authService) {
    this.httpClient = httpClient;
    this.auth = authService;
  }

  configure() {
    this.httpClient.configure(httpConfig => {
      httpConfig.withDefaults({
        headers: {
          'Accept': 'application/json'
        }
      }).withInterceptor(this.auth.tokenInterceptor);
    });
  }
}) || _class);