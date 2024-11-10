var express = require('express'),
	router = express.Router({mergeParams: true}),
	Items = require("../models/items"),
	Comment = require("../models/comments"),
	middleware = require("../middleware");

// route will send user to comment creation page.
router.get("/items/:id/comments/new", middleware.isLoggedIn, (req, res) => {
	Items.findById(req.params.id, (err, items) => {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {items: items});
		}
	});
});

// this logic will create a comment.
router.post("/items/:id/comments/new", middleware.isLoggedIn, (req, res) => {
    Items.findById(req.params.id, (err, items) => {
        if (err) {
            console.log(err);
            res.redirect("/items");
        } else {
			
            // find the profile associated with the user.
            Profile.findOne({ user: req.user._id }, (err, foundProfile) => {
                if (err || !foundProfile) {
                    console.log(err);
                    res.redirect("/items");
                } else {
                    var text = req.body.text;
                    var author = {
                        id: req.user._id,
                        username: req.user.username,
                        city: req.user.city,
                        email: req.user.email,
                        image: req.user.image,
                        profileId: foundProfile._id,
                        profileImage: foundProfile.image,
                        biography: foundProfile.biography,
                        backgroundImage: foundProfile.backgroundImage,
                        facebook: foundProfile.facebook,
                        instagram: foundProfile.instagram,
                        other: foundProfile.other
                    };
                    var newComment = { text: text, author: author };
                    Comment.create(newComment, (err, comment) => {
                        if (err) {
                            console.log(err);
                        } else {
                            comment.author.id = req.user._id;
                            comment.author.username = req.user.username;
                            comment.author.city = req.user.city;
                            comment.author.email = req.user.email;
                            comment.author.image = req.user.image;
                            comment.author.profileId = foundProfile._id;
                            comment.author.profileImage = foundProfile.image;
                            comment.author.biography = foundProfile.biography;
                            comment.author.backgroundImage = foundProfile.backgroundImage;
                            comment.author.facebook = foundProfile.facebook;
                            comment.author.instagram = foundProfile.instagram;
                            comment.author.other = foundProfile.other;
                            comment.save();

                            items.comments.push(comment);
                            items.save();

                            res.redirect("/items/" + items._id);
                        }
                    });
                }
            });
        }
    });
});

// edit a comment.
router.get("/comments/:comment_id/edit", (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {

            // find the item that contains the comment.
            Items.findOne({ comments: req.params.comment_id }, (err, item) => {
                if (err || !item) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {
                        comment: comment,
                        itemId: item._id
                    });
                }
            });
        }
    });
});

// update a comment.
router.put("/comments/:comment_id/update", (req, res) => {
    var newComment = { text: req.body.comment.text };

    Comment.findByIdAndUpdate(req.params.comment_id, newComment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/items/" + req.body.item_id);
        }
    });
});

// delete a comment.
router.get("/comments/:comment_id/delete", middleware.checkProfile, (req, res) => {

    // find the item that contains the comment.
    Items.findOne({ comments: req.params.comment_id }, (err, item) => {
        if (err || !item) {
            console.log(err);
            res.redirect("back");
        } else {
            
            Comment.findByIdAndRemove(req.params.comment_id, (err) => {
                if (err) {
                    res.redirect("back");
                } else {

                    // remove the comment reference from the item's comments array.
                    item.comments.pull(req.params.comment_id);
                    item.save((err) => {
                        if (err) {
                            res.redirect("back");
                        } else {
                            res.redirect("/items/" + item._id);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;