angular.module('adminCtrl', ['userService','dataService','ui.bootstrap', 'boothService'])

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

.controller('adminmarketController', function(User, Data, Booth, $location, $window) {
	var vm = this;

	vm.theuserinfo = Data.getTheUser();

	//all of the booths old and new
	vm.bookedBooths;
	//booths previous to today
	vm.boothHistory = [];
	//booths newer then today
	vm.futureBooths = [];

	//the final object that markethome will bind with.

	//split up the users booths into old and future booths
	vm.bookedBooths = vm.theuserinfo.bookedBooths;
	vm.currDate = new Date();
	//consider how the dateSlot is being put in
	vm.arrlength = vm.bookedBooths.length;
	for(i=0; i<vm.arrlength;i++){
		vm.tempDate = new Date(vm.bookedBooths[i].dateSlot);

		if(vm.tempDate < vm.currDate){
			vm.boothHistory.push(vm.bookedBooths[i]);
		}
		else{
			vm.futureBooths.push(vm.bookedBooths[i]);
		}
	}

	console.log(vm.theuserinfo.username);
	vm.getNeatTime = function(booth) {
		var returnval = booth.dateSlot;
		if (booth.timeSlot == '10001400') {
			returnval += ' 10 AM';
		} else {
			returnval += ' 4 PM';
		}
		return returnval;
	};

	vm.getNeatBooth = function(booth){
		switch(booth.booth_id){
			case 1:
				return 'Merchandise 1';
			case 2:
				return 'Merchandise 2';
			case 3:
				return 'Merchandise 3';
			case 4:
				return 'Merchandise 4';
			case 5:
				return 'Merchandise 5';
			case 6:
				return 'Produce 1';
			case 7:
				return 'Produce 2';
			case 8:
				return 'Produce 3';
			case 9:
				return 'Produce 4';
			case 10:
				return 'Lunch 1';
			case 11:
				return 'Lunch 2';
			case 12:
				return 'Lunch 3';
		}
	};

	vm.cancelBooth = function(booth){
		console.log('attmepting to delete booth');
		var callAnswer = false;
		vex.dialog.confirm({
			message: 'Are you sure you want to cancel your reservation for ' + booth.dateSlot + '? If it is within 24 hours of the booking time, you will be unable to book another booth for 48 hours',
			callback: function(answer) {
				callAnswer = answer
				//if they answer yes, then do the booking
				if(answer){
					Booth.delete(booth._id)
						.success(function(data){
							if(data.success == false){
								vex.dialog.alert( "Something went wrong! Please contact the farmers market if you wish to find out what happened");
							}
							else{
								vex.dialog.alert('Booth has been cancelled');
							}
						});
				}
				//if they answered no, just dont do anything
			},

			//update calander after dialogue closes
			afterClose: function() {
				//only reload the window if they answered yes
				if(callAnswer){
					callAnswer = false;
					$location.url("/adminhome");
				}
			}
		});
	}

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
		var callAnswer = false;
		vex.dialog.confirm({
			message: 'Are you sure you want to close this support request?',
			callback: function(answer) {
				//if they answer yes
				callAnswer = answer;
				if(answer){
					User.deleteRequest(requestID)
						.success(function(data){
							//TODO: this is where the message about them being banned will be displayed
							if(data.success == false){
								vex.dialog.alert("Something went wrong! Please contact the farmers market if you wish to find out what happened");
							}
							else{
								
							}
						});
				}
				//if they answered no, just dont do anything
			},

			//refresh page after it is deleted
			afterClose: function() {
				if(callAnswer){
					callAnswer=false;
					$window.location.reload();
				}
			}
		});
	}
})


.controller('marketAdmin', function($rootScope, User, Data, Booth, Auth, $location, $window){
	var vm = this;

	vm.theuserinfo = Data.getTheUser();

	vm.isSunday;
	vm.date;
	//date chosen by the datepicker, set to what they chose last, or todays date if nothing in session memory
	if($window.sessionStorage.getItem('time'))
		vm.date = new Date($window.sessionStorage.getItem('time'));
	else
		vm.date = new Date();

	//availability of array, goes morning 1-12 then afternoon 1-12
	vm.boothAV = [];

	vm.changeDate = function(){
		//dont allow them to go to a date that is older then today, or more then a year in advance
		vm.todaydate = new Date();

		vm.yesterdaydate = new Date();
		vm.minusday = vm.yesterdaydate.getDate() -1;
		vm.yesterdaydate.setDate(vm.minusday);

		vm.nextyear = new Date();
		vm.extrayear = vm.nextyear.getFullYear() + 1;
		vm.nextyear.setFullYear(vm.extrayear);
		if(vm.date < vm.yesterdaydate){
			vex.dialog.alert("Sorry, you cannot view the history of the schedule");
			vm.date = vm.todaydate;
		}
		else if(vm.date > vm.nextyear){
			vex.dialog.alert("Sorry, you cannot book booths more then a year in advance");
			vm.nextyearminusday = vm.nextyear.getDate() - 1;
			vm.nextyear.setDate(vm.nextyearminusday);
			vm.date = vm.nextyear;
		}
		//find out if the day is a sunday or not
		$window.sessionStorage.setItem('time', vm.date);
		if(vm.date.getDay() == 0)
			vm.isSunday = true;
		else
			vm.isSunday = false;

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
				//it goes 1-12 for morning booths, then 13-24 for afternoon booths. example: 1 and 13 are morning and afternoon of booth 1
				for(i=0; i < day.data.booths.length; i++){
					//have access to the user_id of the owner of the booth here.
					//will have to query for that user to put there username and link to their profile page on each booked book
					//TODO: have the username and link to profile page on each booked booth - maybe
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

	//popup to show a booth is already booked
	vm.boothAlreadyBooked = function() {
		vex.dialog.alert({
			message: 'This booth has already been booked',
			afterClose: function() {
				vm.changeDate();
			}
		});
	};

	//function is called when user clicks on the booth card
	vm.bookBooth = function(booth_id , timeSlot){
		//TODO: **important (just info)** when a booth is booked, there is an object, if it is canceled the object will be deleted
		var callAnswer = false;
		vm.bannedDate = new Date($rootScope.userinfo.banned);
		vm.currDate = new Date();
		//if current date is bigger then banned date(further ahead)
		if(vm.bannedDate > vm.currDate){
			vex.dialog.alert('You are Currently Banned. This was caused by canceling a booking with 24 hours of reservation time. You may reserve booths again on ' + $rootScope.userinfo.banned.substring(0, 21) + ' 24-hour time.');
			return;
		}

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
					callAnswer = answer;
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
							vex.dialog.alert('Congratulations! Booth booked for ' + vm.boothInfo.dateSlot + " at " + userTime);
							$location.url('/adminhome');
						}
					});
				}
				//if they answered no, just dont do anything
			},
			
			//update calander after dialogue closes
			afterClose: function() {
				if(callAnswer) {
					callAnswer = false;
				}
			}
		});
	};

});


