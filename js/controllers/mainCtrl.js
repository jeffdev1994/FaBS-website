angular.module('mainCtrl', ['userService','dataService','authService','ui.bootstrap'])

// #####  SIMPLE ANGULAR APP  #####

.controller('mainController', function(User,Data, $location){

	var vm = this;

	// basic variable to display
	vm.userpromise = User.get(Data.getID(),Data.token);
	vm.userinfo;

	//the return value from User.get is a promise. this waits until the promise is fulfilled. then gives the object to userinfo
	vm.userpromise.then(function(user){
		vm.userinfo = user.data;
		});





	// a list of students that will be displayed on the home page
	vm.students = [
		{first: "David", last: "Johnson"},
		{first: "Ernest", last: "Aaron"}
	];

	vm.studentData = {};

	//function to add student to list
	vm.addStudent = function() {
		// add a computer to the list
		vm.students.push({
			first: vm.studentData.first,
			last: vm.studentData.last,
		});
		// after our computer has been added, clear the form
		vm.studentData = {};
	};

});



