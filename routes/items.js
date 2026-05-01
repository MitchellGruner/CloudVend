var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require("../models/user"),
	Items = require("../models/items"),
	Profile = require("../models/profile"),
	middleware = require("../middleware");

// main page with all items from a specific city.
router.get("/items", middleware.checkProfile, async (req, res) => {
	try {
		const items = await Items.find({});

		res.render("items/index", {
			items: items,
			profileExists: res.locals.profileExists,
			profileId: res.locals.profileId,
			profileImage: res.locals.profileImage
		});
	} catch (err) {
		console.log(err);
		res.redirect("back");
	}
});

// main page with all items regardless of city.
router.get("/items/all", middleware.checkProfile, async (req, res) => {
	try {
		const items = await Items.find({});

		res.render("items/indexAll", {
			items: items,
			profileExists: res.locals.profileExists,
			profileId: res.locals.profileId,
			profileImage: res.locals.profileImage
		});
	} catch (err) {
		console.log(err);
		res.redirect("back");
	}
});

// new item creation page.
router.get("/items/new", middleware.checkProfile, (req, res) => {
	res.render("items/new");
});

// post new item to database.
router.post("/items", async (req, res) => {
	try {
		var name = req.body.name;
		var image = req.body.image;
		var price = req.body.price;
		var condition = req.body.condition;
		var description = req.body.description;

		var author = {
			id: req.user._id,
			username: req.user.username,
			city: req.user.city,
			image: req.user.image
		};

		// find the profile associated with the user.
		const foundProfile = await Profile.findOne({ user: req.user._id });

		if (!foundProfile) {
			return res.redirect("back");
		}

		var profile = {
			id: foundProfile._id,
			image: foundProfile.image
		};

		var newItem = {
			name: name,
			image: image,
			price: price,
			condition: condition,
			description: description,
			author: author,
			profile: profile
		};

		await Items.create(newItem);

		res.redirect("/items/all");
	} catch (err) {
		console.log(err);
		res.redirect("back");
	}
});

// go show more of an item.
router.get("/items/:id", middleware.checkProfile, async (req, res) => {
	try {
		const items = await Items.findById(req.params.id).populate("comments");

		if (!items) {
			return res.redirect("/items");
		}

		res.render("items/show", {
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

// edit an item.
router.get("/items/:id/edit", middleware.checkProfile, async (req, res) => {
	try {
		const items = await Items.findById(req.params.id);

		res.render("items/edit", {
			items: items,
			profileExists: res.locals.profileExists,
			profileId: res.locals.profileId,
			profileImage: res.locals.profileImage
		});
	} catch (err) {
		console.log(err);
		res.redirect("back");
	}
});

// update an item.
router.put("/items/:id/update", async (req, res) => {
	try {
		var newItem = {
			name: req.body.name,
			image: req.body.image,
			price: req.body.price,
			description: req.body.description,
			condition: req.body.condition
		};

		await Items.findByIdAndUpdate(req.params.id, newItem);

		res.redirect("/items/all");
	} catch (err) {
		console.log(err);
		res.redirect("back");
	}
});

// delete an item.
router.get("/items/:id/delete", middleware.checkProfile, async (req, res) => {
	try {
		await Items.findByIdAndRemove(req.params.id);
		res.redirect("/items/all");
	} catch (err) {
		console.log(err);
		res.redirect("/items");
	}
});

module.exports = router;