'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Storage = undefined;

var _dec, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _baseConfig = require('./base-config');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Storage = exports.Storage = (_dec = (0, _aureliaDependencyInjection.inject)(_baseConfig.BaseConfig), _dec(_class = function () {
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
}()) || _class);