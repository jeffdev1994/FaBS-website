var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// schema for vendor
var RequestSchema = new Schema({
    date: {type: Date, required: true},
    title: {type: String, required: true},
    body: {type: String, required:true}
});

/**other methods that vendor has to implement will go in here. dont know if we
 actually need to bother with the getters and setters.*/

module.exports = mongoose.model('request', RequestSchema);
