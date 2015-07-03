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
		var url = 'auth/me';
		return this.http.createRequest(url)
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
		return this.http.createRequest(signupUrl)
		.asPost()
		.withContent({'displayName': displayName,'email': email, 'password':password})
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
		return this.http.createRequest(loginUrl)
		.asPost()
		.withContent({'email': email, 'password':password})
		.send()
		.then(response => {
			this.auth.setToken(response);
			console.log("authservice login ok ");
			return response;
		})
		.catch(err => {
			console.log("error :" + err.content.message);
			throw err;
		});

	};

	logout(redirectUri){
		console.log("log out service");
		return new Promise((resolve, reject)=>{
			this.auth.logout(redirectUri)
			.then(response=>{

			})
			.catch(err=>{


			});
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
		})
		.catch((error)=> {
			console.log("auth problem");
			throw error;
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
			//TODO 
			//return $http.post(unlinkUrl, provider);
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
