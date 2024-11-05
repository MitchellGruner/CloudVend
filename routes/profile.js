var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require("../models/user"),
	Items = require("../models/items"),
	middleware = require("../middleware"),
	Profile = require("../models/profile");

// show profile page.
router.get("/user", middleware.isLoggedIn, middleware.checkProfile, (req, res) => {
	Profile.find({}, (err, profile) => {
		if(err){
			console.log(err);
		} else {
			res.render("user/index", {profiles: profile});
		}
	});
});

// make a new profile.
router.post("/user", (req, res) => {
    var image = req.body.image;
    var biography = req.body.biography;
    var backgroundImage = req.body.backgroundImage;
    var facebook = req.body.facebook;
    var instagram = req.body.instagram;
    var other = req.body.other;
    var user = req.user._id;
    var author = {
        id: req.user._id,
        username: req.user.username,
        city: req.user.city,
        email: req.user.email,
        image: req.user.image
    };
    var newProfile = {image: image, biography: biography, backgroundImage: backgroundImage, facebook: facebook, 
                      instagram: instagram, other: other, user: user, author: author};

    Profile.create(newProfile, (err, profile) => {
        if (err) {
            console.log(err);
        } else {

            // fetch items data
            Items.find({}, (err, items) => {
                if(err){
                    res.redirect("/items");
                } else {
                    res.render("user/show", {profiles: profile, items: items});
                }
            });
        }
    });
});

// get to profile creation page.
router.get("/user/new", middleware.checkProfile, (req, res) => {
	res.render("user/new");
});

// show profile.
router.get("/user/:id", middleware.checkProfile, (req, res) => {
    Profile.findById(req.params.id, (err, profile) => {
        if(err){
            res.redirect("/items");
        } else {
			
            // fetch items data.
            Items.find({}, (err, items) => {
                if(err){
                    res.redirect("/items");
                } else {
                    res.render("user/show", {profiles: profile, items: items});
                }
            });
        }
    });
});

// edit profile.
router.get("/user/:id/edit", (req, res) => {
	Profile.findById(req.params.id, (err, profile) => {
		if(err){
			console.log(err);
		} else {
			res.render("user/edit", {profiles: profile});
		}
	});
});

// update profile.
router.put("/user/:id/update", (req, res) => {
	var image = req.body.image;
	var biography = req.body.biography;
	var backgroundImage = req.body.backgroundImage;
	var facebook = req.body.facebook;
	var instagram = req.body.instagram;
	var other = req.body.other;

	var newProfile = {image: image, biography: biography, backgroundImage: backgroundImage, facebook: facebook,
					  instagram: instagram, other: other};
	Profile.findByIdAndUpdate(req.params.id, newProfile, (err, profile) => {
		if(err){
			res.redirect("landing");
		} else {
			res.redirect("/user/" + req.params.id);
		}
	});
});

// delete profile info.
router.get("/user/:id/delete", (req, res) => {
	Profile.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			res.redirect("/user");
		} else {
			res.redirect("/user");
		}
	});
});

module.exports = router;