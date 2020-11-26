var mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	email: String,
	username: String,
	password: String,
	city: String,
	image: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);