var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// schema for vendor
var DaySchema = new Schema({
    //array of booths for that day
    booths: [Schema.Types.booth],
    //not sure what this is? got it from class diagram
    //put unique, cuz i assume it is unique identifier for the day
    dayName: {type: String, required: true, index: { unique: true }}
});


// method to check if a user should be banned after canceling it
DaySchema.methods.ban = function() {
    var booth = this;


    return 1;
};

/**other methods that vendor has to implement will go in here. dont know if we
 actually need to bother with the getters and setters.*/

module.exports = mongoose.model('Day', DaySchema);
