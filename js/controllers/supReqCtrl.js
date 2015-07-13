angular.module('supReqCtrl', ['userService','dataService','authService','ui.bootstrap'])

// #####  SIMPLE ANGULAR APP  #####

.controller('supportRequestController', function(User, Data, Auth, $location){
	var vm = this;	
		vm.supReq = {
			title: "",
			request: ""
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
		if (vm.supReq.subject == "") {
			alert("Error: Subject field empty. Please fill all fields.");
			return false;
		}

		if (vm.supReq.request == "") {
			alert("Error: request field empty. Please fill all fields.");
			return false;
		}


    	return true;
    };


	vm.saveRequest = function() {
		vm.processing = true;
		vm.message = '';

		//console.log(vm.userData.username);
		// use the create function in the userService
		User.makeRequest(vm.supReq)
			.success(function(data) {
		});
	};



});