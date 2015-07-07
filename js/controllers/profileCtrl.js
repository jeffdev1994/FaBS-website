angular.module('profileCtrl', ['userService','dataService','authService','ui.bootstrap'])

// #####  SIMPLE ANGULAR APP  #####

.controller('profileController', function(User, Data, Auth, $location){
	var vm = this;
	vm.toggleShow=function() {
    document.getElementById("addFields").style.visibility = "visible";
    document.getElementById("addFields").style.position = "relative";
    document.getElementById("showButton").style.visibility = "hidden";





};
	vm.updateInfo=function(){



	}



});