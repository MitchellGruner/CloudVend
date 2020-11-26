var mongoose = require('mongoose');

var itemsSchema = new mongoose.Schema({
	name: String,
	image: String,
	price: String,
	description: String,
	condition: String,
	author: {
	   id: {
		   type: mongoose.Schema.Types.ObjectId,
		   ref: "User"
	   },
	   	username: String,
	  	city: String,
		image: String
  	},
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Items", itemsSchema);