var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        city: String,
        email: String,
        image: String,
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile"
        },
        profileImage: String,
        biography: String,
        backgroundImage: String,
        facebook: String,
        instagram: String,
        other: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);