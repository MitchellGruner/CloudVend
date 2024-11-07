var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require("../models/user"),
	Items = require("../models/items"),
	Profile = require("../models/profile"),
	middleware = require("../middleware");

// main page with all items from a specific city.
router.get("/items", middleware.checkProfile, (req, res) => {
    Items.find({}, (err, items) => {
        if (err) {
            console.log(err);
        } else {
            res.render("items/index", {
                items: items,
                profileExists: res.locals.profileExists,
                profileId: res.locals.profileId,
				profileImage: res.locals.profileImage
            });
        }
    });
});

// main page with all items regardless of city.
router.get("/items/all", middleware.checkProfile, (req, res) => {
	Items.find({}, (err, items) => {
		if(err){
			console.log(err);
		} else {
			res.render("items/indexAll", {
                items: items,
                profileExists: res.locals.profileExists,
                profileId: res.locals.profileId,
				profileImage: res.locals.profileImage
            });
		}
	});
});

// new item creation page.
router.get("/items/new", middleware.checkProfile, (req, res) => {
	res.render("items/new");
});

// post new item to database.
router.post("/items", (req, res) => {
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
    Profile.findOne({ user: req.user._id }, (err, foundProfile) => {
        if (err) {
            return res.redirect("back");
        }

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

        Items.create(newItem, (err, items) => {
            if (err) {
                console.log("Error creating item:", err);
            } else {
                res.redirect("items");
            }
        });
    });
});

// go show more of an item.
router.get("/items/:id", middleware.checkProfile, (req, res) => {
	Items.findById(req.params.id).populate("comments").exec((err, items) => {
		if(err){
			res.redirect("/items");
		} else {
			res.render("items/show", {
				items: items,
                profileExists: res.locals.profileExists,
                profileId: res.locals.profileId,
				profileImage: res.locals.profileImage
			});
		}
	});
});

// edit an item.
router.get("/items/:id/edit", middleware.checkProfile, (req, res) => {
	Items.findById(req.params.id, (err, items) => {
		if(err){
			console.log(err);
		} else {
			res.render("items/edit", {
				items: items,
                profileExists: res.locals.profileExists,
                profileId: res.locals.profileId,
				profileImage: res.locals.profileImage
			});	
		}
	});
});

// update an item.
router.put("/items/:id/update", (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var condition = req.body.condition;

	var newItem = {name: name, image: image, price: price, description: description, condition: condition};
	Items.findByIdAndUpdate(req.params.id, newItem, (err, items) => {
		if(err){
			res.redirect("landing");
		} else {
			res.redirect("/items");
		}
	});
});

// delete an item.
router.get("/items/:id/delete", middleware.checkProfile, (req, res) => {
	Items.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			res.redirect("/items");
		} else {
			res.redirect("/items");
		}
	});
});

module.exports = router;