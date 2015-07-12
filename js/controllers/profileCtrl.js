angular.module('profileCtrl', ['userService','dataService','authService','ui.bootstrap'])

// #####  SIMPLE ANGULAR APP  #####

.controller('profileController', function(User, Data, Auth, $location){
	var vm = this;

	vm.userpromise = Auth.getUser();
	vm.userinfo;
	vm.userPass = {
		password1: "",
		password2: ""
	};


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
	    	if(vm.userPass.password1!=""){
	    		vm.userinfo.password=vm.userPass.password1;
	    	}
	    	alert("Information Updated!");
			vm.saveUser();
			return true;
		} else {
			return false;
		}
			
	};
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		//console.log(vm.userData.username);
		// use the create function in the userService
		User.update(vm.userinfo)
			.success(function(data) {
		});
	};

	vm.validateForm = function() {

		if (vm.userPass.password1 != vm.userPass.password2) {
			alert("Error: Passwords do not match.");
			return false;
		}
		if (vm.userPass.password1.length < 5 && vm.userPass.password1.length > 0) {
			alert("Error: Password must be a least 5 characters.");
			return false;
		}

		re = /.+@.+/;
		if (!re.test(vm.userinfo.email)) {
			alert("Error: Email address not valid (requires '@').");
			return false;
		}
		//XXX-XXX-XXXX would be expected input, dont think its needed to do regex
		if (vm.userinfo.phone.length < 10) {
			alert("Error: Phone number must be atleast 10 numbers long.");
			return false;
		}
		if (vm.userinfo.boothName.length < 1) {
			alert("Error: Please enter a booth name.");
			return false;
		}

		if (vm.userinfo.products.length < 2) {
			alert("Error: Please enter some of the products you plan to sell.\nYou may edit this later.");
			return false;
		}
		if (vm.userinfo.bio.length < 2) {
			alert("Error: Please enter some information about your business and products.");
			return false;
		}


		return true;

	};


});