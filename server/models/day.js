var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// schema for vendor
var BoothSchema = new Schema({
    //array of booths for that day
    booths: [Schema.types.booth],
    //not sure what this is? got it from class diagram
    //put unique, cuz i assume it is unique identifier for the day
    dayName: {type: String, required: true, index: { unique: true }}
});


// method to check if a user should be banned after canceling it
BoothSchema.methods.ban = function() {
    var booth = this;


    return bcrypt.compareSync(password, vendor.password);
};

/**other methods that vendor has to implement will go in here. dont know if we
 actually need to bother with the getters and setters.*/

module.exports = mongoose.model('Vendor', VendorSchema);
