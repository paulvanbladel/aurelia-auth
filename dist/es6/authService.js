import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {Authentication} from './authentication';
import {BaseConfig} from './baseConfig';
import {OAuth1} from './oAuth1';
import {OAuth2} from './oAuth2';
import authUtils from './authUtils';
@inject(HttpClient,Authentication, OAuth1, OAuth2, BaseConfig)
export class AuthService  {
	constructor( http, auth, oAuth1, oAuth2, config){
		this.http = http;
		this.auth = auth;
		this.oAuth1 = oAuth1;
		this.oAuth2 = oAuth2;
		this.config = config.current;
	};

	getMe(){
		var profileUrl = this.auth.getProfileUrl();
		return this.http.createRequest(profileUrl)
		.asGet()
		.send().then(response => {
			return response.content;
		});
	};

	isAuthenticated(){
		return this.auth.isAuthenticated();
	};

	signup(displayName, email, password){
		var signupUrl = this.auth.getSignupUrl();		
		var content;
		if (typeof arguments[0] === 'object') {
			content = arguments[0];
		} else {
			content = {'displayName': displayName,'email': email, 'password':password};
		}		
		return this.http.createRequest(signupUrl)
			.asPost()
			.withContent(content)
			.send()
			.then(response => {
				if (this.config.loginOnSignup) {
					this.auth.setToken(response);
				} else if (this.config.signupRedirect) {
					window.location.href = this.config.signupRedirect;
				}
				return response;
			});
	};

	login(email, password){
		var loginUrl = this.auth.getLoginUrl();
		var content;
		if (typeof arguments[1] !== 'string') {
			content = arguments[0];
		} else {
			content = {'email': email, 'password':password};
		}

		return this.http.createRequest(loginUrl)
		.asPost()
		.withContent(content)
		.send()
		.then(response => {
			this.auth.setToken(response);
			return response;
		});

	};

	logout(redirectUri){
		return new Promise((resolve, reject)=>{
			this.auth.logout(redirectUri)
			.then(response=>{

			})
		});
	};


	authenticate(name, redirect, userData) {
		var provider = this.oAuth2;
		if (this.config.providers[name].type === '1.0'){
			provider = this.oAuth1;
		};

		return provider.open(this.config.providers[name], userData || {})
		.then((response) => {
			this.auth.setToken(response, redirect);
			return response;
		});
	};
	
	unlink(provider) {
		var unlinkUrl =  this.config.baseUrl 
		? authUtils.joinUrl(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

		if (this.config.unlinkMethod === 'get') {
			return this.http.createRequest(unlinkUrl + provider)
                .asGet()
                .send()
                .then(response => {
                    return response;
                });
		}
		else if (this.config.unlinkMethod === 'post') {
			return this.http.createRequest(unlinkUrl)
                .asPost()
                .withContent(provider)
                .send()
                .then(response => {
                    return response;
                });
		}
	};
}
