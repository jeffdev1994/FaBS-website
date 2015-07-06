angular.module('mainCtrl', ['userService','dataService','authService','ui.bootstrap'])

// #####  SIMPLE ANGULAR APP  #####

.controller('mainController', function(User, Data, Auth, $location){

	var vm = this;

	vm.userpromise = Auth.getUser();
	vm.userinfo;

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


	vm.logout = function(){
		Auth.logout();
	};

})

.controller('marketController', function(User, Data, Auth, $location){
	var vm = this;

		//date user chosen by the datepicker, set to current date by default
	vm.date = new Date();

		//TODO:consider changing this to an array instead and initalizing with a forloop over day.booths
	//availability of booth b19
	vm.B19Av = 1;
	/*doing individual functions for each part of the map. this will be 24 in total
	*but allow us to uniquely identify the time and booth they are clicking on
	* syntact is B (booth number) (time, 9 or 2)
	 */
	vm.B19 = function(){
		//if booth 1 at 9am is booked, create a booth for it.
		//maybe i should first check if its been created?
		//   ->i will account for this by just changing the availability and adding the user id if its been created, and they can update it
		//i need to get the 'userinfo' variable from mainController, before i have enough info to create a booth

		//plus one cuz month is 0 based
		console.log(vm.date.getFullYear() + "/" + (vm.date.getMonth() + 1)+ "/" +vm.date.getDate());

		vm.boothInfo = {
			booth_id : 1,
			timeSlot : 10001400,
			dateSlot : vm.date.getFullYear() + "/" + (vm.date.getMonth() + 1)+ "/" +vm.date.getDate()
			//user_id : userinfo._id;
		}
		

	};












});



