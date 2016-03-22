export {AuthService} from './authService';
export {AuthorizeStep} from './authorizeStep';
import {BaseConfig} from './baseConfig';
import {FetchConfig} from './app.fetch-httpClient.config';
export {FetchConfig} from './app.fetch-httpClient.config';
import './authFilter';
export function configure(aurelia, configCallback) {
  aurelia.globalResources('./authFilter');

  let baseConfig = aurelia.container.get(BaseConfig);
  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(baseConfig);
  }
}
