var mongoose = require('mongoose');

var profileSchema = new mongoose.Schema({
	image: String,
	biography: String,
	backgroundImage: String,
	facebook: String,
	instagram: String,
	other: String,
	author: {
	   id: {
		   type: mongoose.Schema.Types.ObjectId,
		   ref: "User"
	   },
	   	username: String,
	   	city: String,
	   	email: String,
		image: String,
  	}
});

module.exports = mongoose.model("Profile", profileSchema);