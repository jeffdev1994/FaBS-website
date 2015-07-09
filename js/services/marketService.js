/**
 * used this briefly, but dont think i need it anymore
 * not deleting it yet just incase
 * main idea was to be able to pass data between controllers
 */
angular.module('marketService', [])

    .factory('Market', function($http) {

        // create a new object
        var marketFactory = {};

        marketFactory.getBookingForDate = function(date) {
            return $http.get('/api/booking/' + date);
        };

        marketFactory.saveBooking = function(data) {
            return $http.post('/api/booking/', data);
        };

        marketFactory.getBookingForUser = function() {
            return $http.get('/api/users/bookings');
        };

        marketFactory.cancelBooking = function(id){
            return $http.delete('/api/users/cancelBooking/'+ id);

        };

        // var userID;
        // // get a single user
        // marketFactory.getID = function() {
        //     return userID;
        // };
        // marketFactory.setID = function(id) {
        //     userID = id;
        // };

        return marketFactory;

    });
