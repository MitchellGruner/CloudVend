const Profile = require('../models/profile');

// all the middleware goes here
var middlewareObj = {};

// middleware for determining if user is logged in.
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

// middleware for checking if a profile exists
middlewareObj.checkProfile = async function (req, res, next) {
    try {
        if (req.isAuthenticated()) {
            const foundProfile = await Profile.findOne({ user: req.user._id });

            if (!foundProfile) {
                res.locals.profileExists = false;
                res.locals.profileId = null;
                res.locals.profileImage = null;
            } else {
                res.locals.profileExists = true;
                res.locals.profileId = foundProfile._id;
                res.locals.profileImage = foundProfile.image;
            }
        } else {
            res.locals.profileExists = false;
            res.locals.profileId = null;
            res.locals.profileImage = null;
        }

        next();
    } catch (err) {
        console.log("checkProfile error:", err);
        res.locals.profileExists = false;
        res.locals.profileId = null;
        res.locals.profileImage = null;
        next();
    }
};

// middleware for setting currentUser
middlewareObj.setCurrentUser = function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
};

module.exports = middlewareObj;