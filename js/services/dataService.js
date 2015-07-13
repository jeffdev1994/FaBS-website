/**
 * used this briefly, but dont think i need it anymore
 * not deleting it yet just incase
 * main idea was to be able to pass data between controllers
 */
angular.module('dataService', [])

    .factory('Data', function($http) {

        // create a new object
        var dataFactory = {};

        var userID;
        // get a single user
        dataFactory.getTheUser = function() {
            return userID;
        };
        dataFactory.setTheUser = function(id) {
            userID = id;
        };

        return dataFactory;
    });
