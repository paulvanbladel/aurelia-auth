'use strict';

System.register(['aurelia-dependency-injection', './base-config'], function (_export, _context) {
  "use strict";

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
          this.storage = this._getStorage(this.config.storage);
        }

        Storage.prototype.get = function get(key) {
          return this.storage.getItem(key);
        };

        Storage.prototype.set = function set(key, value) {
          return this.storage.setItem(key, value);
        };

        Storage.prototype.remove = function remove(key) {
          return this.storage.removeItem(key);
        };

        Storage.prototype._getStorage = function _getStorage(type) {
          if (type === 'localStorage') {
            if ('localStorage' in window && window.localStorage !== null) return localStorage;
            throw new Error('Local Storage is disabled or unavailable.');
          } else if (type === 'sessionStorage') {
            if ('sessionStorage' in window && window.sessionStorage !== null) return sessionStorage;
            throw new Error('Session Storage is disabled or unavailable.');
          }

          throw new Error('Invalid storage type specified: ' + type);
        };

        return Storage;
      }()) || _class));

      _export('Storage', Storage);
    }
  };
});