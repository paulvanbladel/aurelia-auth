import {inject} from 'aurelia-dependency-injection';
import {BaseConfig} from './baseConfig';

@inject(BaseConfig)
export class Storage {
  constructor(config) {
    this.config = config.current;
    this.storage = this._getStorage(this.config);
  }

  get(key) { return this.storage.getItem(key); }
  set(key, value) { return this.storage.setItem(key, value); }
  remove(key) { return this.storage.removeItem(key); }

  _getStorage(config) {
    let storageType = config.storage;
    if (storageType !== 'localStorage' && storageType !== 'sessionStorage') {
      throw new Error('Invalid storage type specified: ' + this.config.storage);
    }


    if (this.config.storage === 'localStorage') {
      if (!('localStorage' in window) || window.localStorage === null || window.localStorage === undefined) {
        throw new Error('Local storage is disabled or unavailable.');
      }

      return localStorage;
    }


    if (!('sessionStorage' in window) || window.sessionStorage === null || window.sessionStorage === undefined) {
      throw new Error('Session storage is disabled or unavailable.');
    }

    return sessionStorage;
  }
}
