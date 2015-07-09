angular.module('marketCtrl', ['marketService', 'angularMoment', 'ngDialog'])

.controller('marketController', function(Market, $scope, amMoment, ngDialog, $route) {
    var curDate;
    var boothName;
    var timeSlot;
    $scope.curDate = new Date();
    var day = new moment($scope.curDate);
    $scope.Day = day.format("dddd, MMMM Do YYYY");
    console.log($scope.Day);

    $scope.openTimed = function(data) {
       
        var date = new moment(data.date);
        date = date.format("dddd, MMMM Do YYYY");
        console.log(date);
        var message = "<b>Please make it to the venue appropriately to account for time required to set up your booth. Cheers!</b>";
        var dialog = ngDialog.open({
                    template: '<p>Congratulations! You have successfully booked the ' + data.boothName + ' booth for the ' + data.timeSlot +" session, on " + date + '.\n' + message + '</p>',
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
            modalView = "./views/pages/bookedBoothDialog.html";
            console.log('lol');
        }

        if(result === false){
            modalView = "./views/pages/bookingDialog.html";
        }

        ngDialog.open({
            template: modalView,
            className: 'ngdialog-theme-default',
            controller: 'marketController',
            data: data
        });
    };

    $scope.confirmBooking = function(){
            console.log($scope.ngDialogData);

            Market.saveBooking($scope.ngDialogData)
                .success(function(status){

                    $scope.closeThisDialog();
                    $scope.openTimed($scope.ngDialogData);
                    $route.reload();
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

        Market.getBookingForDate(curDate)
            .success(function(data){
                // console.log(data);
                var boothList = ["Merchandise-1", "Merchandise-2", "Merchandise-3", "Merchandise-4", "Merchandise-5", "Produce-1", "Produce-2", "Produce-3", "Produce-4", "Lunch-1", "Lunch-2", "Lunch-3"];
                
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

                var refreshMap = function(){
                    
                    for (var j = 0; j < boothList.length; j++){

                    var className1 = null;
                    var className2 = null;

                    toggleWeekdaySunday(curDateDay);

                    if(curDateDay !== "Sunday"){
                        className1 = "#" + boothList[j] + "-10am";
                        className2 = "#" + boothList[j] + "-4pm";
                    }

                    else{
                        className1 = "#" + boothList[j] + "-12pm";
                    }

                    if ( angular.element($(className1).hasClass("booth-unavailable")) ){
                        // console.log(className1);
                        angular.element($(className1)).removeClass("booth-unavailable").addClass("booth-available");
                        }

                    if(className2 !== null){
                        if( angular.element($(className2).hasClass("booth-unavailable")) ){
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
                            if (data[i].timeSlot === "10am") {
                                angular.element($("#" + data[i].boothName + "-10am")).removeClass("booth-available").addClass("booth-unavailable");
                            } else {
                                // console.log(data[i].boothName);
                                angular.element($("#" + data[i].boothName + "-4pm")).removeClass("booth-available").addClass("booth-unavailable");
                            }
                        }
                    }

                };

                refreshMap();
                //refresh map to null
                console.log("data len " + data.length);

                paintBookings(data);
                //paint map according to bookings

            })

        .error(function(data, status){
            alert("Get Booking Failed");
            console.log(data, status);
        });
    });
});