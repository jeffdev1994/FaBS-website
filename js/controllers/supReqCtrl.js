angular.module('supReqCtrl', ['userService','dataService','authService','ui.bootstrap'])

// #####  SIMPLE ANGULAR APP  #####

.controller('supportRequestController', function(User, Data, Auth, $location){
	var vm = this;	
		vm.supReq = {
			title: "",
			body: ""
		};

    vm.sendRequest = function() {
	    if (vm.validateForm()) {
			vm.saveRequest();
			return true;
		} else {
			return false;
		}
			
	};


    vm.validateForm = function() {
    	console.log("subject is " + vm.supReq.title);
		if (vm.supReq.title == "") {
			alert("Error: Subject field empty. Please fill all fields.");
			return false;
		}

		if (vm.supReq.body == "") {
			alert("Error: request field empty. Please fill all fields.");
			return false;
		}


    	return true;
    };


	vm.saveRequest = function() {
		vm.processing = true;
		vm.message = '';
		console.log("into save rqeust");

		//console.log(vm.userData.username);
		// use the create function in the userService
		User.makeRequest(vm.supReq)
			.success(function(data) {

				if(data.success == false){
					console.log("Support Request not sucessful");
					vm.processing = false;

				}
				else {
					vex.dialog.alert("Support Request sent.");
					vm.processing = false;
					//if it makes it to here, then user was successfully created, perhaps a popup. then back to login page
					//alert("new user successfully created! please login");
					$location.path("/markethome");

				}



		});
	};



});