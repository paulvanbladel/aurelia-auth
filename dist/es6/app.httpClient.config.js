import {HttpClient, RequestBuilder} from 'aurelia-http-client';
import {BaseConfig}  from './baseConfig';
import {Authentication} from './authentication';
import {Storage} from './storage';
import {inject} from 'aurelia-framework';
@inject(HttpClient,Authentication,Storage, BaseConfig )
export  default class  {
	constructor(http, auth, storage, config ){
		this.http = http;
		this.auth = auth;
		this.storage = storage;
		this.config = config.current;
	}

	configure(){
		RequestBuilder.addHelper('authTokenHandling', ()=>{
			return (client, processor, message)=>{
				if (this.auth.isAuthenticated() && this.config.httpInterceptor) {
					var tokenName = this.config.tokenPrefix 
					? this.config.tokenPrefix + '_' + this.config.tokenName : this.config.tokenName;
					var token = this.storage.get(tokenName);

					if (this.config.authHeader && this.config.authToken) {
						token = this.config.authToken + ' ' + token;
					}

					message.headers.add(this.config.authHeader, token);
				}
			}
		});

		this.http.configure(x => {
			x.authTokenHandling();
			x.withHeader('Accept', 'application/json');
		});	
	}
}
