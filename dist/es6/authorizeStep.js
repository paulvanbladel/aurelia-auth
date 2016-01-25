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
import { Authentication } from './authentication';
import { Redirect } from 'aurelia-router';
export let AuthorizeStep = class {
    constructor(auth) {
        this.auth = auth;
    }
    run(routingContext, next) {
        var isLoggedIn = this.auth.isAuthenticated();
        var loginRoute = this.auth.getLoginRoute();
        if (routingContext.getAllInstructions().some(i => i.config.auth)) {
            if (!isLoggedIn) {
                console.log("login route : " + loginRoute);
                return next.cancel(new Redirect(loginRoute));
            }
        }
        else if (isLoggedIn && routingContext.getAllInstructions().some(i => i.fragment) == loginRoute) {
            var loginRedirect = this.auth.getLoginRedirect();
            return next.cancel(new Redirect(loginRedirect));
        }
        return next();
    }
};
AuthorizeStep = __decorate([
    inject(Authentication), 
    __metadata('design:paramtypes', [Authentication])
], AuthorizeStep);
