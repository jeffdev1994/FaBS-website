angular.module('profileCtrl', ['userService','dataService','authService','ui.bootstrap'])

// #####  SIMPLE ANGULAR APP  #####

.controller('profileController', function(User, Data, Auth, $location){
	var vm = this;

	vm.userpromise = Auth.getUser();
	vm.userinfo;

	//the return value from Auth.getUser is a promise. this waits until the promise is fulfilled.
	vm.userpromise.then(function(user){
		//second layer of the call. getUser returns the _id, and then have to do a second call
		//when i had it as 1 function, it was giving an error for not being able to edit header(?)
		vm.userpromise2 = Auth.getUserInfo(user.data.id);
		//getUserInfo takes the _id and returns the whole user object
		vm.userpromise2.then(function(user){
			//the final object that markethome will bind with.
			vm.userinfo = user.data
		});

	});
	vm.toggleShow=function() {
    document.getElementById("addFields").style.visibility = "visible";
    document.getElementById("addFields").style.position = "relative";
    document.getElementById("showButton").style.visibility = "hidden";





};

	vm.attemptUpdate = function() {

	    if (vm.validateForm()) {
			vm.saveUser();
			return true;
		} else {
			return false;
		}
			
	};
	vm.saveUser = function() {
		console.log("saveUser() called");
		vm.processing = true;
		vm.message = '';

		//console.log(vm.userData.username);
		// use the create function in the userService
		User.update(vm.userinfo)
			.success(function(data) {
		});
	};

	vm.validateForm = function() {
		return true;

	};


});