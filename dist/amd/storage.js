define(['exports', 'aurelia-dependency-injection', './baseConfig'], function (exports, _aureliaDependencyInjection, _baseConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Storage = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Storage = exports.Storage = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
    function Storage(config) {
      _classCallCheck(this, Storage);

      this.config = config.current;
    }

    Storage.prototype.get = function get(key) {
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
    };

    Storage.prototype.set = function set(key, value) {
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
    };

    Storage.prototype.remove = function remove(key) {
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
    };

    return Storage;
  }()) || _class);
});