import {inject} from 'aurelia-dependency-injection';
import {BaseConfig} from './baseConfig';

@inject(BaseConfig)
export class Storage {
  constructor(config) {
    this.config = config.current;
  }

  get(key) {
    switch (this.config.storage) {
    case 'localStorage':
      if ('localStorage' in window && window['localStorage'] !== null) {
        return localStorage.getItem(key);
      } else {
        console.warn('Warning: Local Storage is disabled or unavailable');
        return undefined;
      }
      break;

    case 'sessionStorage':
      if ('sessionStorage' in window && window['sessionStorage'] !== null) {
        return sessionStorage.getItem(key);
      } else {
        console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');
        return undefined;
      }
      break;
    }
  }

  set(key, value) {
    switch (this.config.storage) {
    case 'localStorage':
      if ('localStorage' in window && window['localStorage'] !== null) {
        return localStorage.setItem(key, value);

      } else {
        console.warn('Warning: Local Storage is disabled or unavailable.  will not work correctly.');
        return undefined;
      }
      break;

    case 'sessionStorage':
      if ('sessionStorage' in window && window['sessionStorage'] !== null) {
        return sessionStorage.setItem(key, value);
      } else {
        console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');
        return undefined;
      }
      break;
    }
  }

  remove(key) {
    switch (this.config.storage) {
    case 'localStorage':
      if ('localStorage' in window && window['localStorage'] !== null) {
        return localStorage.removeItem(key);
      } else {
        console.warn('Warning: Local Storage is disabled or unavailable.  will not work correctly.');
        return undefined;
      }
      break;

    case 'sessionStorage':
      if ('sessionStorage' in window && window['sessionStorage'] !== null) {
        return sessionStorage.removeItem(key);

      } else {
        console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');
        return undefined;
      }
      break;
    }
  }
}
