var express = require('express'),
	router = express.Router({ mergeParams: true }),
	Items = require("../models/items"),
	Comment = require("../models/comments"),
	Profile = require("../models/profile"),
	middleware = require("../middleware");

// route will send user to comment creation page.
router.get("/items/:id/comments/new", middleware.isLoggedIn, async (req, res) => {
	try {
		const items = await Items.findById(req.params.id);

		if (!items) {
			console.log("Item not found");
			return res.redirect("/items");
		}

		res.render("comments/new", { items: items });
	} catch (err) {
		console.log(err);
		res.redirect("/items");
	}
});

// this logic will create a comment.
router.post("/items/:id/comments/new", middleware.isLoggedIn, async (req, res) => {
	try {
		const items = await Items.findById(req.params.id);

		if (!items) {
			console.log("Item not found");
			return res.redirect("/items");
		}

		// find the profile associated with the user.
		const foundProfile = await Profile.findOne({ user: req.user._id });

		if (!foundProfile) {
			console.log("Profile not found");
			return res.redirect("/items");
		}

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

		const comment = await Comment.create(newComment);

		items.comments.push(comment);
		await items.save();

		res.redirect("/items/" + items._id);

	} catch (err) {
		console.log(err);
		res.redirect("/items");
	}
});

// edit a comment.
router.get("/comments/:comment_id/edit", async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.comment_id);

		if (!comment) {
			console.log("Comment not found");
			return res.redirect("back");
		}

		const item = await Items.findOne({ comments: req.params.comment_id });

		if (!item) {
			console.log("Item not found");
			return res.redirect("back");
		}

		res.render("comments/edit", {
			comment: comment,
			itemId: item._id
		});

	} catch (err) {
		console.log(err);
		res.redirect("back");
	}
});

// update a comment.
router.put("/comments/:comment_id/update", async (req, res) => {
	try {
		var newComment = { text: req.body.comment.text };

		const updatedComment = await Comment.findByIdAndUpdate(
			req.params.comment_id,
			newComment,
			{ new: true }
		);

		if (!updatedComment) {
			return res.redirect("back");
		}

		res.redirect("/items/" + req.body.item_id);

	} catch (err) {
		console.log(err);
		res.redirect("back");
	}
});

// delete a comment.
router.get("/comments/:comment_id/delete", middleware.checkProfile, async (req, res) => {
	try {
		const item = await Items.findOne({ comments: req.params.comment_id });

		if (!item) {
			console.log("Item not found");
			return res.redirect("back");
		}

		await Comment.findByIdAndDelete(req.params.comment_id);

		// remove reference from item
		item.comments.pull(req.params.comment_id);
		await item.save();

		res.redirect("/items/" + item._id);

	} catch (err) {
		console.log(err);
		res.redirect("back");
	}
});

module.exports = router;