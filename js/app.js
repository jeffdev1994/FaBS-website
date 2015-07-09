// #####  SIMPLE ANGULAR APP  #####
angular.module('userApp', ['app.routes','userService','authService','dataService', 'marketService', 'mainCtrl','userCtrl', 'marketCtrl', 'angularMoment', 'ngDialog'])

.config(function($httpProvider){

        $httpProvider.interceptors.push('AuthInterceptor');

    });
