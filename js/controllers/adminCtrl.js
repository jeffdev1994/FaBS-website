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