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
	
	vm.userData = {
		username: "",
		password1: "",
		password2: "",
		email: "",
		phone: "",
		boothName: "",
		boothType: "",
		products: "",
		bio: ""
	};
	
    vm.attemptSave = function() {
		console.log("calling attemptSave()");
	    if (vm.validateForm()) {
			vm.saveUser();
			return true;
		} else {
			return false;
		}
			
	};

    vm.validateForm = function() {
		if (vm.userData.password1 != vm.userData.password2) {
			alert("Error: Passwords do not match.");
			return false;
		}
		if (vm.userData.password1.length < 5) {
			alert("Error: Password must be a least 5 characters.");
			return false;
		}
		if (vm.userData.username.length < 4) {
			alert("Error: Username must be at least 4 characters.");
			return false;
		}
		re = /.+@.+/;
		if (!re.test(vm.userData.email)) {
			alert("Error: Email address not valid (requires '@').");
			return false;
		}
		else {
		  return true;
		}
	};

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a user
	vm.saveUser = function() {
		console.log("saveUser() called");
		vm.processing = true;
		vm.message = '';

		//console.log(vm.userData.username);
		// use the create function in the userService
		User.create(vm.userData)
			.success(function(data) {
				console.log("user created .SUCCESS");
				vm.processing = false;
				vm.message = data.message;
		});
		console.log("user created");
			
	};



});


