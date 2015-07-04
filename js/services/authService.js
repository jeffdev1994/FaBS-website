/**
 * Created by Jeff on 2015-07-04.
 */

angular.module('authService',[])

.factory('Auth', function($http,$q,AuthToken){

        var authFactory = {};

        authFactory.login = function(userData){
            return $http.post('/api/authenticate', userData)
                .success(function(data){
                    AuthToken.setToken(data.token);
                    return data;

                });
        };

        authFactory.logout = function(){
            //log them out by clearing the token
            AuthToken.setToken();
        };

        authFactory.isLoggedIn = function(){
            //if there is a token, they are logged in
            if (AuthToken.getToken())
                return true;
            else
                return false
        };

        //get info from the logged in user
        authFactory.getUser = function(){
            if(AuthToken.getToken())
                return $http.get('/api/me');
            else
                return $q.reject({message: 'user has no token'});
        };


        return authFactory;

    })



.factory('AuthToken', function($window){
        var authTokenFactory = {};

        //gets token out of local storage
        authTokenFactory.getToken = function(){
            return $window.localStorage.getItem('token');
        };

        //sets or clears token
        //sets if there is a token passed
        //clears if param is empty
        authTokenFactory.setToken = function(token){
            //if it is not null
            if(token)
                $window.localStorage.setItem('token', token);
            else
                $window.localStorage.removeItem('token');
        };

        return authTokenFactory;

    })


.factory('AuthInterceptor', function($q,$location,AuthToken){
        var interceptorFactory = {};

        //happens on all http requests
        interceptorFactory.request = function(config){
            var token = AuthToken.getToken();

            //if token exists, put it in the header
            if(token)
                config.headers['x-access-token'] = token

            return config;
        };

        //happens on errors
        interceptorFactory.responseError = function(response){
            //if they do not have token to get in, we will get a 403 error back
            if(response.status == 403)
                $location.path('/');

            return $q.reject(response);
        };

        return interceptorFactory;

    });