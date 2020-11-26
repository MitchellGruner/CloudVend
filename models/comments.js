var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			href: "User"
		},
		username: String,
		city: String
	}
});

module.exports = mongoose.model("Comment", commentSchema);