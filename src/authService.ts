import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Authentication} from './authentication';
import {BaseConfig, IBaseConfig} from './baseConfig';
import {OAuth1} from './oAuth1';
import {OAuth2} from './oAuth2';
import authUtils from './authUtils';
@inject(HttpClient, Authentication, OAuth1, OAuth2, BaseConfig)
export class AuthService {
    config: IBaseConfig;
    constructor(private http:HttpClient, private auth:Authentication, private oAuth1:OAuth1,private oAuth2:OAuth2, config:BaseConfig) {       
        this.config = config.current;
    }

    getMe() {
		var profileUrl = this.auth.getProfileUrl();
    return this.http.fetch(profileUrl)
      .then(status)
      .then(toJson)
      .then((response) => {
        return response
		});
  }

    isAuthenticated() {
		return this.auth.isAuthenticated();
  }

    getTokenPayload() {
		return this.auth.getPayload();
  }

    signup(displayName, email, password) {
		var signupUrl = this.auth.getSignupUrl();
		var content;
		if (typeof arguments[0] === 'object') {
			content = arguments[0];
		} else {
      content = {
        'displayName': displayName,
        'email': email,
        'password': password
      };
		}

    return this.http.fetch(signupUrl, {
      method: 'post',
      body: json(content)
    })
      .then(status)
      .then(toJson)
      .then((response) => {
				if (this.config.loginOnSignup) {
					this.auth.setToken(response);
				} else if (this.config.signupRedirect) {
					window.location.href = this.config.signupRedirect;
				}
				return response;
			});
  }

    login(email, password) {
		var loginUrl = this.auth.getLoginUrl();
		var content;
		if (typeof arguments[1] !== 'string') {
			content = arguments[0];
		} else {
            content = { 'email': email, 'password': password };
        }
        
        if(this.config.postContentType === 'json'){
            content = JSON.stringify(content);
        }else if(this.config.postContentType === 'form'){
            var data = [];
            for(var key in content){
                data.push(key+"="+content[key]);
            }
            content = data.join('&');
		}

        return this.http.fetch(loginUrl, {
          method: 'post',
          body: content
        })
          .then(status)
          .then(toJson)
          .then((response) => {
                if (this.config.useRefreshToken) {
                    this.auth.setRefreshToken(response);
                }
                this.auth.setToken(response);
                return response;
            });

    };

  logout(redirectUri) {
    return this.auth.logout(redirectUri);
  }

	authenticate(name, redirect, userData) {
		var provider:OAuth1 | OAuth2 = this.oAuth2;
        if (this.config.providers[name].type === '1.0') {
			provider = this.oAuth1;
		};

		return provider.open(this.config.providers[name], userData || {})
		.then((response) => {
			this.auth.setToken(response, redirect);
			return response;
		});
  }

	unlink(provider) {
    var unlinkUrl = this.config.baseUrl ? authUtils.joinUrl(this.config.baseUrl, this.config.unlinkUrl) : this.config.unlinkUrl;

		if (this.config.unlinkMethod === 'get') {
      return this.http.fetch(unlinkUrl + provider)
        .then(status)
        .then(toJson)
        .then((response) => {
                    return response;
                });
    } else if (this.config.unlinkMethod === 'post') {
      return this.http.fetch(unlinkUrl, {
        method: 'post',
        body: json(provider)
      })
        .then(status)
        .then(toJson)
        .then((response) => {
                    return response;
                });
		}
  }
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function toJson(response) {
  return response.json()
}