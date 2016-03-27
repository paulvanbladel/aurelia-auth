export {AuthService} from './auth-service';
export {AuthorizeStep} from './authorize-step';
export {FetchConfig} from './auth-fetch-config';
import {BaseConfig} from './base-config';

export function configure(aurelia, configCallback) {
  aurelia.globalResources('./auth-filter');

  let baseConfig = aurelia.container.get(BaseConfig);
  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(baseConfig);
  }
}
