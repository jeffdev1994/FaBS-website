angular.module('adminCtrl', ['userService','dataService','ui.bootstrap'])

.controller('adminController', function(User, Data, $location, $window) {

	var vm = this;
	vm.users;

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
		

	vm.goToVendor = function(theuser){

		vm.theuserinfo = theuser;
		Data.setTheUser(theuser);
		$location.url("/adminmarket");
	};
})

.controller('adminmarketController', function(User, Data, $location, $window) {
	var vm = this;

	vm.theuserinfo = Data.getTheUser();
	console.log(vm.theuserinfo.username);

})


.controller('supportRequest', function(User, Data, $window) {
	var vm = this;

	vm.requestpromise = User.getRequests();
	console.log(vm.requestpromise);
	vm.requests;

	vm.requestpromise.then(function(requests){
		console.log(requests.data);
		vm.requests = requests.data;
	});

	vm.getNiceDate = function(date){
		return	date.substring(0,10);
	};



	vm.openReq = function(body){
		vex.dialog.alert(body);
		//vex.dialog.alert('<div style="text-align:center;">Support Request:<br> Problem description here</div>');
	};

	vm.clearReq = function(requestID){
		console.log(requestID);
		vex.dialog.confirm({
			message: 'Are you sure you want to close this support request?',
			callback: function(answer) {
				//if they answer yes
				if(answer){
					User.deleteRequest(requestID)
						.success(function(data){
							//TODO: this is where the message about them being banned will be displayed
							if(data.success == false){
								vex.dialog.alert("Something went wrong! Please contact the farmers market if you wish to find out what happened");
							}
							else{
								vex.dialog.alert('Request is now closed');
							}
						});

				}
				//if they answered no, just dont do anything
			},

			//refresh page after it is deleted
			//TODO: it refreshes even if you cancel.  doesnt work if you put the reloud in the callback
			afterClose: function() {
				$window.location.reload();
			}
		});
	}
});