Profile = require('../models/profile');

// all the middleware goes here
var middlewareObj = {};

// middleware for determining if user is logged in.
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");    
};

// middleware for checking if a profile exists
middlewareObj.checkProfile = function(req, res, next) {
    if (req.isAuthenticated()) { // Ensure the user is authenticated
        Profile.findOne({ user: req.user._id }, (err, foundProfile) => {
            if (err) {
                res.locals.profileExists = false;
            } else {
                res.locals.profileExists = !!foundProfile;
            }
            next();
        });
    } else {
        res.locals.profileExists = false;
        next();
    }
};

// middleware for setting currentUser
middlewareObj.setCurrentUser = function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
};

module.exports = middlewareObj;