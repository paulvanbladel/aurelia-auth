var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject } from 'aurelia-framework';
import { BaseConfig } from './baseConfig';
export let Storage = class {
    constructor(config) {
        this.config = config.current;
    }
    get(key) {
        switch (this.config.storage) {
            case 'localStorage':
                if ('localStorage' in window && window['localStorage'] !== null) {
                    return localStorage.getItem(key);
                }
                else {
                    console.warn('Warning: Local Storage is disabled or unavailable');
                    return undefined;
                }
                break;
            case 'sessionStorage':
                if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                    return sessionStorage.getItem(key);
                }
                else {
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
                }
                else {
                    console.warn('Warning: Local Storage is disabled or unavailable.  will not work correctly.');
                    return undefined;
                }
                break;
            case 'sessionStorage':
                if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                    return sessionStorage.setItem(key, value);
                }
                else {
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
                }
                else {
                    console.warn('Warning: Local Storage is disabled or unavailable.  will not work correctly.');
                    return undefined;
                }
                break;
            case 'sessionStorage':
                if ('sessionStorage' in window && window['sessionStorage'] !== null) {
                    return sessionStorage.removeItem(key);
                }
                else {
                    console.warn('Warning: Session Storage is disabled or unavailable.  will not work correctly.');
                    return undefined;
                }
                break;
        }
    }
};
Storage = __decorate([
    inject(BaseConfig), 
    __metadata('design:paramtypes', [Object])
], Storage);
