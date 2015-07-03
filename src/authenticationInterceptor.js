export class AuthenticateInterceptor {
  request(message) {
    if(message.noAuthToken){
      console.log("no auth token handling in auth interceptor");
    }
    else {
      console.log("here the interceptor should add the json token");

    }
    /*if (shared.isAuthenticated() && config.httpInterceptor) {
      var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' 
              + config.tokenName : config.tokenName;
      var token = storage.get(tokenName);

      if (config.authHeader && config.authToken) {
        token = config.authToken + ' ' + token;
      }


      request.headers[config.authHeader] = token;
    }*/
      //message.headers.add("Authorization22", "bearer 123");
    return message;
}
    response(message){
      if (true) {
            // add some auth token
            return message;
        } else {
            throw new Error('not-authenticated');
        }
    }
}