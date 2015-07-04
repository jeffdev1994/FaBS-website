// STEP 3
angular.module('dataService', [])

    .factory('Data', function($http) {

        // create a new object
        var dataFactory = {};

        var userID;
        var token;
        // get a single user
        dataFactory.getID = function() {
            return userID;
        };
        dataFactory.setID = function(id) {
            userID = id;
        };

        return dataFactory;

    });
