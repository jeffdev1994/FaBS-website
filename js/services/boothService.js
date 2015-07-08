//this is really more of a market service then booth service
angular.module('boothService', [])

    .factory('Booth', function($http) {

        // create a new object
        var boothFactory = {};

        // get a single user
        boothFactory.getDay = function(dayName) {
            // since this call requires a user ID we'll add the id to
            // the end of the URL
            return $http.get('/api/days/' + dayName);
        };
/*
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

        boothFactory.delete = function(booth_id){
            return $http.delete('/api/booths/' + booth_id);
        }

        return boothFactory;

    });
