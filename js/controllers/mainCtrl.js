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

.controller('supportRequest', function(User, Data, Auth,$scope, $window) {
	var vm = this;

	vm.requestpromise = User.getRequests();
		console.log(vm.requestpromise);
	vm.requests;

	vm.requestpromise.then(function(requests){
		console.log(requests);
		vm.requests = requests;
	});




	vm.openReq = function(body){
		vex.dialog.alert(body);
     	//vex.dialog.alert('<div style="text-align:center;">Support Request:<br> Problem description here</div>');
     };

     vm.clearReq = function(requestID){
     	vex.dialog.alert('Support request cleared!');


		 vex.dialog.confirm({
			 message: 'Are you sure you want to close this support request?',
			 callback: function(answer) {
				 //if they answer yes
				 if(answer){
					 User.deleteRequest(requestID)
						 .success(function(data){
							 //TODO: this is where the message about them being banned will be displayed
							 if(data.success == false){
								 vex.dialog.alert( "Something went wrong! Please contact the farmers market if you wish to find out what happened");
							 }
							 else{
								 vex.dialog.alert('Request is now closed');
							 }
						 });
				 }
				 //if they answered no, just dont do anything
			 },

			 //refresh page after it is deleted
			 afterClose: function() {
				 $window.location.reload();
			 }
		 });
     }
 })

;

