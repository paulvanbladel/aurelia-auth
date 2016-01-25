import {HttpClient, RequestBuilder} from 'aurelia-http-client';
import {BaseConfig, IBaseConfig}  from './baseConfig';
import {Authentication} from './authentication';
import {Storage} from './storage';
import {inject} from 'aurelia-framework';
@inject(HttpClient, Authentication, Storage, BaseConfig)
export default class {
  config: IBaseConfig;
  constructor(private http: HttpClient, private auth: Authentication, private storage: Storage, config: BaseConfig) {
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
      (<any>x).authTokenHandling();
      x.withHeader('Accept', 'application/json');
    });
  }
}
