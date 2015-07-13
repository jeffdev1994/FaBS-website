// #####  SIMPLE ANGULAR APP  #####


angular.module('userApp', ['app.routes','userService','authService','dataService','boothService','adminCtrl','mainCtrl','userCtrl',"profileCtrl","profViewCtrl"])



.config(function($httpProvider){

        $httpProvider.interceptors.push('AuthInterceptor');

    });