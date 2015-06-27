angular.module('userCtrl', ['userService'])

.controller('userController', function(User) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the users at page load
	User.all()
		.success(function(data) {

			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.users = data;
		});
		
	// STEP 8 - add function to delete user
	// this should be added to the userController since
	// deleting a user will occur from the all Users view

	// function to delete a user 
	vm.deleteUser = function(id) {
		vm.processing = true;

		User.delete(id)
			.success(function(data) {

				// get all users to update the table
				// you can also set up your api 
				// to return the list of users with the delete call
				User.all()
					.success(function(data) {
						vm.processing = false;
						vm.users = data;
					});
			});
	};
})

// STEP 7 - add create user controller
.controller('userCreateController', function(User) {

	var vm = this;
	
    vm.attemptSave = function() {
		console.log("calling attemptSave()");
	    if (vm.validateForm()) {
			vm.saveUser();
			return true;
		} else {
			alert("Error: Passwords do not match.");
			return false;
		}
			
	};

    vm.validateForm = function() {
		if (User.password1 == User.password2) {
		  return true;
		} else {
		  return false;
		}
	};

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the userService
		User.create(vm.userData)
			.success(function(data) {
				vm.processing = false;
				vm.userData = {};
				vm.message = data.message;
		});
			
	};



});


