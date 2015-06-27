
 angular.module('app.routes', ['ngRoute'])

// Configuring the routes
.config(function($routeProvider, $locationProvider){

	$routeProvider

	// Route for home page
	.when("/", {
		templateUrl: 'views/pages/home.html',
		controller: 'mainController',
		controllerAs: 'main'
	})

	// Route for users page
	.when("/users", {
		templateUrl: 'views/pages/users/all.html',
		controller: 'userController',
		controllerAs: 'user'
	})

	.when("/users/create", {
		templateUrl: 'views/pages/users/single.html',
		controller: 'userCreateController',
		controllerAs: 'user'
	})

	// Route for about page
	.when("/about", {
		templateUrl: 'views/pages/about.html'
	})

	//route for log-in
	.when("/vendors", {
		templateUrl: 'views/pages/about.html'
	})

	//route for vendor main page after log in
	.when("/markethome", {
		templateUrl: 'views/pages/markethome.html',
	})

	// route for registration page
	.when("/registration", {
		templateUrl: 'views/pages/registration.html'
	});



	// Added to remove the # from URLs
	$locationProvider.html5Mode(true);
});

