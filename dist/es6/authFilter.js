import {inject} from 'aurelia-dependency-injection';
import {Authentication} from './authentication';

@inject(Authentication)
export class AuthFilterValueConverter {
  constructor(auth) {
    this.auth = auth;
  }
  toView(routes) {
    return routes.filter(r => this.auth.isAuthorised(r.config.auth));
  }
}
