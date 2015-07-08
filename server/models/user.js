var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


// schema for vendor
var VendorSchema = new Schema({
	boothName: { type: String, required: true},
	username: { type: String, required: true, index: { unique: true }},
	//had to remove 'select:False' cuz it was breaking the comparePassword method
	//if you cant return password, then it cant send it, and bcrypt throws an error
	password: { type: String, required: true},
	email: { type: String, required: true},
	bio: { type: String, required: true},
	phone: { type: String, required: true},
	boothtype: { type: String, required: true},
	//this is how to make an array. use products.push(object)
	//http://mongoosejs.com/docs/schematypes.html
	products: { type: String, required: true},
	bookedBooths: [Schema.Types.booth],
	//holds some sort of identifier for booths they have booked before
	history: [],
	banned: {type: Boolean, default: false}
});

// hash the password before the user is saved
VendorSchema.pre('save', function(next) {
	var vendor = this;

	// hash the password only if the password has been changed or user is new
	if (!vendor.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(vendor.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		vendor.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
VendorSchema.methods.comparePassword = function(password) {
	var vendor = this;

	return bcrypt.compareSync(password, vendor.password);
};

/**other methods that vendor has to implement will go in here. dont know if we
actually need to bother with the getters and setters.*/

module.exports = mongoose.model('Vendor', VendorSchema);
