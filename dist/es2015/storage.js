var _dec, _class;

import { inject } from 'aurelia-dependency-injection';
import { BaseConfig } from './base-config';

export let Storage = (_dec = inject(BaseConfig), _dec(_class = class Storage {
  constructor(config) {
    this.config = config.current;
    this.storage = this._getStorage(this.config.storage);
  }

  get(key) {
    return this.storage.getItem(key);
  }
  set(key, value) {
    return this.storage.setItem(key, value);
  }
  remove(key) {
    return this.storage.removeItem(key);
  }
  _getStorage(type) {
    if (type === 'localStorage') {
      if ('localStorage' in window && window.localStorage !== null) return localStorage;
      throw new Error('Local Storage is disabled or unavailable.');
    } else if (type === 'sessionStorage') {
      if ('sessionStorage' in window && window.sessionStorage !== null) return sessionStorage;
      throw new Error('Session Storage is disabled or unavailable.');
    }

    throw new Error('Invalid storage type specified: ' + type);
  }
}) || _class);