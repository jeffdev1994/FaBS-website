angular.module('profViewCtrl', ['userService','dataService','authService','ui.bootstrap'])

// #####  SIMPLE ANGULAR APP  #####

.controller('profileViewController', function(User, Data, Auth, $location, $routeParams){
	var vm = this;

		vm.user_id = $routeParams.userID;
		vm.userinfo;
		console.log("user ID is " + vm.user_id);

		vm.userpromise = Auth.getUserInfo(vm.user_id);
		//getUserInfo takes the _id and returns the whole user object
		vm.userpromise.then(function(user){
			//the final object that markethome will bind with.
			vm.userinfo = user.data
		});



});