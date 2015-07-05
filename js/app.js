// #####  SIMPLE ANGULAR APP  #####
angular.module('userApp', ['app.routes','userService','authService','dataService','mainCtrl','userCtrl'])

.config(function($httpProvider){

        $httpProvider.interceptors.push('AuthInterceptor');

    });