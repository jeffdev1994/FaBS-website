// #####  SIMPLE ANGULAR APP  #####
angular.module('userApp', ['app.routes','userService','authService','dataService','boothService','mainCtrl','userCtrl',"profileCtrl"])

.config(function($httpProvider){

        $httpProvider.interceptors.push('AuthInterceptor');

    });