var mongoose = require('mongoose');
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
    dateSlot: {type: Number, required: true},
    //mongo assigns an _id to things. and this is what we use to search for users
    user_id: {type: String}
});


// method to check if a user should be banned after canceling it
BoothSchema.methods.ban = function() {
    var booth = this;


    return bcrypt.compareSync(password, vendor.password);
};

/**other methods that vendor has to implement will go in here. dont know if we
 actually need to bother with the getters and setters.*/

module.exports = mongoose.model('Vendor', VendorSchema);
