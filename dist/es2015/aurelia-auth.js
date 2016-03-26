export { AuthService } from './authService';
export { AuthorizeStep } from './authorizeStep';
export { FetchConfig } from './app.fetch-httpClient.config';
import { BaseConfig } from './baseConfig';

export function configure(aurelia, configCallback) {
  aurelia.globalResources('./authFilter');

  let baseConfig = aurelia.container.get(BaseConfig);
  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(baseConfig);
  }
}