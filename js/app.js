// #####  SIMPLE ANGULAR APP  #####
angular.module('userApp', ['app.routes','userService','authService','dataService','mainCtrl','userCtrl','profileCtrl'])

.config(function($httpProvider){

        $httpProvider.interceptors.push('AuthInterceptor');

    });