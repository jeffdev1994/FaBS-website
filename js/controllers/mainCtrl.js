angular.module('mainCtrl', ['userService','dataService','authService','ui.bootstrap', 'boothService'])

// #####  SIMPLE ANGULAR APP  #####

.controller('mainController', function($rootScope, User, Data, Auth, $location){


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
			vm.userinfo = user.data;
			//so it is accessible inside of marketcontroller as well
			$rootScope.userinfo = user.data;
		});

	});


	vm.logout = function(){
		Auth.logout();
	};

})

.controller('marketController', function($rootScope, User, Data,Booth, Auth, $location){
	var vm = this;


	//TODO: consider adding in a timer interval, so the page refreshes and they see what booths are available
	//https://codeforgeek.com/2014/09/refresh-div-angularjs-interval/
		
		//date user chosen by the datepicker, set to current date by default
	vm.date = new Date();

	//availability of array, goes morning 1-12 then afternoon 1-12
	vm.boothAV = [];

	vm.changeDate = function(){
		vm.dateString = vm.date.getFullYear() + "-" + (vm.date.getMonth() + 1)+ "-" +vm.date.getDate();
		vm.daypromise = Booth.getDay(vm.dateString);

		vm.daypromise.then(function(day){

			//if day.data.success == false; then the day isnt made, they are all available
			if(day.data.success == false){
				for(i=1; i < 25; i++){
					vm.boothAV[i] = 1;
				}
			}
			//otherwise iterate through day.data.booths[] and make the correct ones taken if it appears
			else{
				//start by setting all to 1
				for(i=1; i < 25; i++) {
					vm.boothAV[i] = 1;
				}

				//the ones which have a booth, set to 0
				for(i=0; i < day.data.booths.length; i++){
					vm.boothNum = day.data.booths[i].booth_id;
					vm.boothTime = day.data.booths[i].timeSlot;
					if(vm.boothTime == 16002000)
						vm.boothAV[vm.boothNum + 12] = 0;
					else if(vm.boothTime == 10001400)
						vm.boothAV[vm.boothNum] = 0;
				}
			}
		});
	};

	//call it initially so that the date is correct after loading
	vm.changeDate();

	//function is called when user clicks on the booth card
	vm.bookBooth = function(booth_id , timeSlot){
		//TODO: **important** when a booth is booked, there is an object, if it is canceled the object will be deleted

		//variable for displaying the time to user
		vm.userTime;
		if(timeSlot == 10001400)
			userTime = "10am";
		else if(timeSlot == 16002000)
			userTime = "4pm";

		//holds the info needed for creating a new booth
		vm.boothInfo = {
			booth_id : booth_id, //this an timeSlot vals are from arguments
			timeSlot : timeSlot,
			dateSlot : vm.date.getFullYear() + "-" + (vm.date.getMonth() + 1)+ "-" +vm.date.getDate(),
			user_id : $rootScope.userinfo._id
		};

		vex.dialog.confirm({
			message: 'Confirm booking for ' + vm.boothInfo.dateSlot + " at " + userTime,
			callback: function(answer) {
				//if they answer yes, then do the booking
				if(answer){
					//create the booth using the booth info
					Booth.create(vm.boothInfo).success(function(data) {
						//if it was false, then a booth of the same time date and id is already created
						//this shouldnt happen, if a booth is there, it shouldnt be clickable
						//possibility if two people book the same booth at the same time
						if(data.success == false){
							vex.dialog.alert( "Something went wrong! Another vendor may have booked this booth a little faster than you. Please contact the farmers market if you wish to find out what happened");
						}
						else {
							console.log("booth created .SUCCESS");
							//if it makes it to here, then user was successfully created, perhaps a popup. then back to login page
							//alert("new user successfully created! please login");
							vex.dialog.alert('Congratulations! Booth booked for ' + vm.boothInfo.dateSlot + " at " + userTime);
							//TODO:reset the calender - not working!
							vm.changeDate();
						}
					});
				}
				//if they answered no, just dont do anything
			}
		});


	};












});



