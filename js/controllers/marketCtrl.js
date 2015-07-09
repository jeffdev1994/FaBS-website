angular.module('marketCtrl', ['marketService', 'angularMoment', 'ngDialog'])

.controller('marketController', function(Market, $scope, amMoment, ngDialog, $route) {
    var curDate;
    var boothName;
    var timeSlot;
    $scope.curDate = new Date();
    $scope.bookings = [];

    var day = new moment($scope.curDate);
    $scope.Day = day.format("dddd, MMMM Do YYYY");

    console.log($scope.Day);

    Market.getBookingForUser()
        .success(function(data) {
            $scope.bookings = data;
            console.log(data);
        })

        .error(function(data, status){
            console.log(data, status);
        });

    var toggleWeekdaySunday = function(day){

        if(day === "Sunday"){
            // console.log('lol');

            if( $(".weekday").hasClass("hideDiv") === false ){
                $(".weekday").addClass("hideDiv");
            }
            
            if( $(".sunday").hasClass("hideDiv") === true){
                $(".sunday").removeClass("hideDiv");
            }
        }

        if(day !== "Sunday"){
            // console.log(day);
            // console.log("here");
            if( ($(".weekday").hasClass("hideDiv")) === true ){
                $(".weekday").removeClass("hideDiv");
                // console.log("here1");

            }

            if( $(".sunday").hasClass("hideDiv") === false ){
                $(".sunday").addClass("hideDiv");
            }
        }
    };

    var refreshMap = function(boothList){
                            
        for (var j = 0; j < boothList.length; j++){

        var className1 = null;
        var className2 = null;

        var curDateDay = moment(curDate).format('dddd');

        toggleWeekdaySunday(curDateDay);

        if(curDateDay !== "Sunday"){
            className1 = "#" + boothList[j] + "-10am";
            className2 = "#" + boothList[j] + "-4pm";
        }

        else{
            // console.log(curDateDay);
            className1 = "#" + boothList[j] + "-12pm";
        }

        if ( angular.element($(className1)).hasClass("booth-unavailable") ){
            angular.element($(className1)).removeClass("booth-unavailable").addClass("booth-available");
            }

        if(className2 !== null){
            if( angular.element($(className2)).hasClass("booth-unavailable") ){
                // console.log(className2);
                angular.element($(className2)).removeClass("booth-unavailable").addClass("booth-available");
                }
            }
        }
    };

    //re paint map according to bookings
    var paintBookings = function(data){
        if(data.length > 0){
            for (var i = 0; i < data.length; i++) {

                if (data[i].timeSlot === "12pm") {
                    angular.element($("#" + data[i].boothName + "-12pm")).removeClass("booth-available").addClass("booth-unavailable");
                }

                else if (data[i].timeSlot === "10am") {
                    angular.element($("#" + data[i].boothName + "-10am")).removeClass("booth-available").addClass("booth-unavailable");
                } else {
                    // console.log(data[i].boothName);
                    angular.element($("#" + data[i].boothName + "-4pm")).removeClass("booth-available").addClass("booth-unavailable");
                }
            }
        }

    };

    var refreshScreen = function(curDateDay){

        console.log("Hehehheheheheheheh");
        console.log(curDate);

        Market.getBookingForDate(curDate)
            .success(function(data){
                console.log(data);
                var boothList = ["Merchandise-1", "Merchandise-2", "Merchandise-3", "Merchandise-4", "Merchandise-5", "Produce-1", "Produce-2", "Produce-3", "Produce-4", "Lunch-1", "Lunch-2", "Lunch-3"];
                console.log("going into refresh map");
                refreshMap(boothList);
                //refresh map to null
                console.log("data len " + data.length);
                paintBookings(data);
                //paint map according to bookings

            })

            .error(function(data, status){
                alert("Get Booking Failed");
                console.log(data, status);
                });
    };


    var deleteBooking2 = function(id){
            
        console.log("lol");

        var curDateDay = moment(curDate).format('dddd');
        Market.cancelBooking(id)
            .success(function(result){
            console.log("Booking has been deleted!");
            refreshScreen(curDateDay);
            console.log($scope.$parent.curDate);
        })

            .error(function(result,status){
            console.log(result,status);
            });
    };

    $scope.deleteBooking = function($event){

        var id = $event.srcElement.id;

        vex.dialog.confirm({
        
            message: 'Are you sure you want to delete your booking?',

            callback: function(answer) {
            //if they answer yes, then do the booking
                if(answer){
                    deleteBooking2(id);
                }
            //if they answered no, just dont do anything
            },

            //update calander after dialogue closes
            afterClose: function() {
                // refreshScreen();
                $route.reload();
            }

        });

    };

    $scope.openTimed = function(data) {
       
        var date = new moment(data.date);
        date = date.format("dddd, MMMM Do YYYY");
        console.log(date);
        var message = '<b>Please make it to the venue appropriately to account for time required to set up your booth. Cheers!</b> </p> <div style="margin-top:5%"class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog()">Close</button></div>';
        var dialog = ngDialog.open({
                    template: '<p>Congratulations! You have successfully booked the ' + data.boothName + ' booth for the ' + data.timeSlot +" session, on " + date + '.\n' + message,          
                    plain: true,
                    closeByDocument: false,
                    closeByEscape: false
                });

        setTimeout(function () {
            dialog.close();
        }, 15000);

    };

    $scope.open = function($event){
        // console.log($event.srcElement.className);
        var nameAndTime = ($event.srcElement.id).split("-");
        console.log($event.srcElement.className);
        console.log($event.srcElement.id);

        data = {
            boothName: nameAndTime[0] + "-" + nameAndTime[1],
            timeSlot: nameAndTime[2],
            date: curDate
        };

        console.log(data);

        var srcElementClass = $event.srcElement.className;
        var pattern = new RegExp("booth-unavailable");
        var result = pattern.test(srcElementClass);

        var modalView;

        if(result === true){
            vex.dialog.alert("This booth is no longer available for booking. Please try booking another booth.");
        }

        if(result === false){
        
        vex.dialog.confirm({
        
            message: 'Confirm Booking?',

            callback: function(answer) {
            //if they answer yes, then do the booking
                if(answer){
                    confirmBooking(data);
                }
            //if they answered no, just dont do anything
            },

            //update calander after dialogue closes
            afterClose: function() {
                refreshScreen();
                $scope.apply();
            }
        });

        }

    };

    var confirmBooking = function(data){

            Market.saveBooking(data)
                .success(function(status){
                    console.log("Booking confirmed");
                    $scope.openTimed(data);
                    console.log(status);
                })

                .error(function(data, status) {
                    console.log(data, status);
                });
    };


    $scope.$watch("curDate", function(newVal, oldVal) {
        // console.log("newVal: " + newVal);
        // console.log("oldVal: " + oldVal);
        curDate = moment(newVal).format("MM-DD-YYYY");
        $scope.Day = moment(curDate).format("dddd, MMMM Do YYYY");
        console.log($scope.Day);
        var curDateDay = moment(curDate).format('dddd');
        refreshScreen(curDateDay);
    });


});