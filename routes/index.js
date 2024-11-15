var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/user'),
	Profile = require('../models/profile'),
	middleware = require("../middleware"),
	Items = require("../models/items");

// initial get route.
router.get("/", (req, res) => {
	res.render("landing");
});

// register form.
router.get("/register", (req, res) => {
	res.render("register");
});

// sign up logic.
router.post("/register", (req, res) => {
	User.register((
    	{email: req.body.email,
		 username: req.body.username,
		 city: req.body.city
		}), req.body.password, (err) => {
			if(err){
				console.log(err);
				return res.render("register");
			} else {
				passport.authenticate("local")(req, res, () => {
					res.redirect("items/all");
				});
    		}
  		});
});

// login form.
router.get("/login", (req, res) => {
	res.render("login");
});

// login logic.
router.post("/login", passport.authenticate("local", {
		successRedirect: "/items/all",
		failureRedirect: "/login"
	}), (req, res) => {
});

// logout logic.
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

// show login form.
router.get("/items/login", (req, res) => {
	res.render("login");
});

module.exports = router;