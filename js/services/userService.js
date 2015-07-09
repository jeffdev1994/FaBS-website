// STEP 3
angular.module('userService', [])

.factory('User', function($http) {

	// create a new object
	var userFactory = {};

	// get a single user
	userFactory.get = function(id) {
		// since this call requires a user ID we'll add the id to
		// the end of the URL
		return $http.get('/api/users/' + id);
	};

	// get all users
	userFactory.all = function() {
		return $http.get('/api/users/');
	};

	//create a new user
	userFactory.create = function(userData){
		// since this is a post method we need to include userData
		// from our form
		console.log("got to user services");
		return $http.post('/api/users', userData);
	};

	//log a user in
	userFactory.login = function(userData){
		console.log("userService userdata.username: " + userData.username);
		return $http.post('/api/authenticate', userData);
	};

	userFactory.delete = function(id){

		return $http.delete('/api/users/' + id);
	};

	userFactory.getRequests = function(){
		return $http.get('/api/support');
	};

	userFactory.makeRequest = function(requestData){
		return $http.post('/api/support', requestData);
	};

	userFactory.deleteRequest = function(requestID){
		return $http.delete('/api/support/' + requestID);
	};

	return userFactory;

});
