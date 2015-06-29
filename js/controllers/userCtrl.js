angular.module('userCtrl', ['userService','ui.bootstrap'])

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
		//all of the fields are mandatory, send an error alert if any of the fields are left empty
		//or dont match needed information


		//TODO: move new user to logged in page after successfully being registered

		if (vm.userData.password1 != vm.userData.password2) {
			vm.addAlert("Error: Passwords do not match.");
			return false;
		}
		if (vm.userData.password1.length < 5) {
			vm.addAlert("Error: Password must be a least 5 characters.");
			return false;
		}
		if (vm.userData.username.length < 4) {
			vm.addAlert("Error: Username must be at least 4 characters.");
			return false;
		}
		re = /.+@.+/;
		if (!re.test(vm.userData.email)) {
			vm.addAlert("Error: Email address not valid (requires '@').");
			return false;
		}
		//XXX-XXX-XXXX would be expected input, dont think its needed to do regex
		if (vm.userData.phone.length < 10) {
			vm.addAlert("Error: Phone number must be atleast 10 numbers long.");
			return false;
		}
		if (vm.userData.boothName.length < 1) {
			vm.addAlert("Error: Please enter a booth name.");
			return false;
		}
		if (vm.userData.boothType.length < 1) {
			vm.addAlert("Error: Please select a booth type.");
			return false;
		}
		if (vm.userData.products.length < 2) {
			vm.addAlert("Error: Please enter some of the products you plan to sell.\nYou may edit this later.");
			return false;
		}
		if (vm.userData.bio.length < 2) {
			vm.addAlert("Error: Please enter some information about your business and products.");
			return false;
		}

		//if all requirements are met, return true
		return true;

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

	//trying this out
	//https://angular-ui.github.io/bootstrap/
	vm.alert = {};

	vm.addAlert = function(message) {
		//remove data from the array so we dont get more message each time
		//probably a better way to do this. with a normal message
		vm.alert = {msg: message, type: 'danger'};
	};


	vm.closeAlert = function() {
		vm.alert = {};
	};

});


