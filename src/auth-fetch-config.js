import {inject} from 'aurelia-dependency-injection';
import {HttpClient} from 'aurelia-fetch-client';
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
        .withInterceptor(this.auth.tokenInterceptor);
    });
  }
}
