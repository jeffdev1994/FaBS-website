// STEP 3
angular.module('boothService', [])

    .factory('Booth', function($http) {

        // create a new object
        var boothFactory = {};
/*
        // get a single user
        boothFactory.get = function(id) {
            // since this call requires a user ID we'll add the id to
            // the end of the URL
            return $http.get('/api/users/' + id);
        };

        // get all users
        boothFactory.all = function() {
            return $http.get('/api/users/');
        };
*/
        //create a new booth
        boothFactory.create = function(boothData){
            // since this is a post method we need to include userData
            // from our form
            console.log("got to booth services");
            return $http.post('/api/booths', boothData);
        };


        return userFactory;

    });
