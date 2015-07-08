var mongoose = require('mongoose');
var User       = require('../models/user');
var Day       = require('../models/day');
var Schema = mongoose.Schema;


// schema for vendor
var BoothSchema = new Schema({
    //default is false because they only get created when someone books them
    available: {type: Boolean, default: false},
    booth_id: {type: Number, required: true},
    //supposed to be 10001400 , or 16002000(24 hour start time)(24 hour end time).
    //chose this for scalablility, but we could also just go to like 1, 2 instead
    timeSlot: {type: Number, required: true},
    //yyyy/mm/dd
    //this and timeslot are from the SRS. could change it to more simple conventions
    dateSlot: {type: String, required: true},
    //mongo assigns an _id to things. and this is what we use to search for users
    user_id: {type: String}
});

BoothSchema.index({ booth_id: 1, timeSlot: 1, dateSlot: 1}, { unique: true });


////before it is removed, remove it from user booths, and day
//BoothSchema.post('remove', function(booth){
//    console.log("*********this booth belongs to  and should be removed from day ");
//
//    //db.vendor.update(
//    //    {},
//    //    {$pull: {bookedBooths: {_id : booth._id}}},
//    //    {multi: true}
//    //);
//});

//before the booth is deleted, remove it from the user and the day
BoothSchema.pre('remove', function (next) {
    var booth = this;
    console.log('%s has been removed', booth._id);

    //remove from the user
    User.findByIdAndUpdate(booth.user_id, {$pull: {bookedBooths: {_id : booth._id}}}, function(err, data){
        //console.log(err, data);
    });

    //remove from the day
    Day.findOneAndUpdate({dayName: booth.dateSlot},{$pull: {booths: {_id : booth._id}}},function(err, data ){
        //console.log(err, data);
    });

    //check if they should be banned
    var date = new Date();
    var twodays = date.getDate() + 2;
    date.setDate(twodays);
    //var dateString = date.getFullYear() + "-" + (date.getMonth() + 1)+ "-" +date.getDate();
    var boothtime = new Date(booth.dateSlot);

    //days are 0 based, so have to add 1 to make it the proper day
    //set the hour to 10 or 4, depending on timeSlot
    console.log(booth.timeSlot == 10001400);
    if(booth.timeSlot == 10001400)
        boothtime.setHours(10);
    else
        boothtime.setHours(16);

    console.log("******************************");
    console.log(date);
    console.log(boothtime);
    //if todays date+2days is greater then the time of the booking, then they will be banned
    if(date > boothtime){
        //TODO: have to set a banned variable or something in the user (currently isnt a field for that). and somehow get a message back to them that they are now banned
        //possibly make it so everytime they refresh the page and are banned, it shows an alert, that way we wont have to do anything here
        //just check for banned in main controller each time.

    }

    next();
});

//after it is saved, add it to user booths, and add it to the day
BoothSchema.post('save', function(booth){
    //this needs to add itself to booked booths of user, and booths of day
   console.log("**************this booth belongs to %s and should go in day %s",booth.user_id,booth.dateSlot);

    User.findById(booth.user_id, function(err, vendor) {
        vendor.bookedBooths.push(booth);

        vendor.save(function(err){
            if (err) throw err;

            console.log('user updated with new booth');
        })
    });

    Day.findOne({dayName: booth.dateSlot})
        .exec(function(err,day){
            if(err) throw err;

            //if that day is not there, create one
            if(!day){
                var day = new Day();
                day.dayName = booth.dateSlot;
                day.booths.push(booth);

                day.save(function(err){
                    if (err) throw err;

                    console.log('new day created');
                });
            }
            //if the booth is there, add the booth to it
            else if(day){
                day.booths.push(booth);

                day.save(function(err){
                   if(err) throw err;

                    console.log('booth added to day');
                });
            }
        });



});



// method to check if a user should be banned after canceling it
BoothSchema.methods.ban = function() {
    var booth = this;


    return bcrypt.compareSync(password, vendor.password);
};

/**other methods that vendor has to implement will go in here. dont know if we
 actually need to bother with the getters and setters.*/


module.exports = mongoose.model('booth', BoothSchema);

