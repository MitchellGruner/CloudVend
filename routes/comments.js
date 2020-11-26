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
	})
});

// this logic will create a comment.
router.post("/items/:id/comments/new", middleware.isLoggedIn, (req, res) => {
	Items.findById(req.params.id, (err, items) => {
		if(err){
			console.log(err);
			res.redirect("/items");
		} else {
			var text = req.body.text;
			var author = {
				id: req.user._id,
				username: req.user.username,
				city: req.user.city
			};
			var newComment = {text: text, author: author};
			Comment.create(newComment, (err, comment) => {
				if(err){
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.author.city = req.user.city;
					comment.save();
					
					items.comments.push(comment);
					items.save();
					
					console.log(comment);
					
					res.redirect("/items/" + items._id);
				}
			});
		}
	});
});

// comment destroy route.
router.delete("/comments/:comment_id", (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/items/" + req.params.id);
		}
	});
});

module.exports = router;