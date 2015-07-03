//import {AuthService} from './authService';
export {AuthService} from './authService';

//import {AuthorizeStep} from './authorizeStep';
export {AuthorizeStep} from './authorizeStep';
//import {AuthFilterValueConverter} from './authFilter';
import {AuthFilterValueConverter} from './authFilter';

import {BaseConfig} from './baseConfig';




export function configure(aurelia, configCallback){
	var version = "versie 1.0.10";
	
	//aurelia.globalizeResources('./hello-world');
	
	var authFilterValueConverter = aurelia.container.get(AuthFilterValueConverter);

	aurelia.withSingleton(AuthFilterValueConverter, authFilterValueConverter);
	var baseConfig = aurelia.container.get(BaseConfig);
	if(configCallback !== undefined && typeof(configCallback) === 'function')
	{
		configCallback(baseConfig);
	}
};

