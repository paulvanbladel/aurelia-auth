'use strict';

System.register(['aurelia-dependency-injection', './baseConfig'], function (_export, _context) {
  var inject, BaseConfig, _dec, _class, Storage;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }],
    execute: function () {
      _export('Storage', Storage = (_dec = inject(BaseConfig), _dec(_class = function () {
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
      }()) || _class));

      _export('Storage', Storage);
    }
  };
});