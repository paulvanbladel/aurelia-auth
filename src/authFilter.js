import {inject} from 'aurelia-framework';
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
