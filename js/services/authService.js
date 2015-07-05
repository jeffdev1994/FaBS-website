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
            return $http.get('/api/me');
            //the book says to do it like this. but i didnt know how to handle the q.reject.
            //it allowed to go to /markethome, even if they werent logged in, cuz it wouldnt throw a 403
            /*
            if(AuthToken.getToken()) {
                return $http.get('/api/me');
            }
            else
                return $q.reject({message: 'user has no token'});*/
        };

        authFactory.getUserInfo = function(userID){
            if(AuthToken.getToken()){
                return $http.get('/api/users/' + userID);
            }
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
            if(token) {
                config.headers['x-access-token'] = token;
                console.log($location.path());
                //TODO: only do this if the keep me logged in option is checked.
                /*
                if($location.path() == '/') {
                    $location.url('/markethome');
                }*/
            }
            return config;
        };

        //happens on errors
        interceptorFactory.responseError = function(response){
            //if they do not have token to get in, we will get a 403 error back
            if(response.status == 403) {
                AuthToken.setToken();
                $location.path('/');
            }

            return $q.reject(response);
        };

        return interceptorFactory;

    });