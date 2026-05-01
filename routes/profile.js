var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require("../models/user"),
	Items = require("../models/items"),
	middleware = require("../middleware"),
	Profile = require("../models/profile");

// show profile page.
router.get("/user", middleware.isLoggedIn, middleware.checkProfile, async (req, res) => {
	try {
		const profiles = await Profile.find({});

		res.render("user/index", {
			profiles: profiles,
			profileExists: res.locals.profileExists,
			profileId: res.locals.profileId,
			profileImage: res.locals.profileImage
		});
	} catch (err) {
		console.log(err);
		res.redirect("/items");
	}
});

// make a new profile.
router.post("/user", async (req, res) => {
	try {
		var newProfile = {
			image: req.body.image,
			biography: req.body.biography,
			backgroundImage: req.body.backgroundImage,
			facebook: req.body.facebook,
			instagram: req.body.instagram,
			other: req.body.other,
			user: req.user._id,
			author: {
				id: req.user._id,
				username: req.user.username,
				city: req.user.city,
				email: req.user.email,
				image: req.user.image
			}
		};

		const profile = await Profile.create(newProfile);

		const items = await Items.find({});

		res.render("user/show", {
			profiles: profile,
			items: items,
			profileExists: true,
			profileId: profile._id,
			profileImage: profile.image
		});
	} catch (err) {
		console.log(err);
		res.redirect("/items");
	}
});

// get to profile creation page.
router.get("/user/new", middleware.checkProfile, (req, res) => {
	res.render("user/new");
});

// show profile.
router.get("/user/:id", middleware.checkProfile, async (req, res) => {
	try {
		const profile = await Profile.findById(req.params.id);

		if (!profile) {
			return res.redirect("/items");
		}

		const items = await Items.find({});

		res.render("user/show", {
			profiles: profile,
			items: items,
			profileExists: res.locals.profileExists,
			profileId: res.locals.profileId,
			profileImage: res.locals.profileImage
		});
	} catch (err) {
		console.log(err);
		res.redirect("/items");
	}
});

// edit profile.
router.get("/user/:id/edit", async (req, res) => {
	try {
		const profile = await Profile.findById(req.params.id);

		res.render("user/edit", { profiles: profile });
	} catch (err) {
		console.log(err);
		res.redirect("back");
	}
});

// update profile.
router.put("/user/:id/update", async (req, res) => {
	try {
		var newProfile = {
			image: req.body.image,
			biography: req.body.biography,
			backgroundImage: req.body.backgroundImage,
			facebook: req.body.facebook,
			instagram: req.body.instagram,
			other: req.body.other
		};

		await Profile.findByIdAndUpdate(req.params.id, newProfile);

		res.redirect("/user/" + req.params.id);
	} catch (err) {
		console.log(err);
		res.redirect("back");
	}
});

// delete profile info.
router.get("/user/:id/delete", async (req, res) => {
	try {
		await Profile.findByIdAndRemove(req.params.id);
		res.redirect("/user");
	} catch (err) {
		console.log(err);
		res.redirect("/user");
	}
});

module.exports = router;