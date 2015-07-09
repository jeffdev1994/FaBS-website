var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema for vendor
var BookingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    timeSlot: {
        type: String,
        enum: ["9am", "4pm", "12pm"],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    boothName: {
        type: String,
        required: true,
    }

});


// method to check if a user should be banned after canceling it
// BoothSchema.methods.ban = function() {
//     var booth = this;
//
//
//     return bcrypt.compareSync(password, vendor.password);
// };

/**other methods that vendor has to implement will go in here. dont know if we
 actually need to bother with the getters and setters.*/


module.exports = mongoose.model('booking', BookingSchema);
