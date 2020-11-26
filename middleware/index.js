// all the middleware goes here
var middlewareObj = {};
	
// middleware for determining if user is logged in.
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");	
};

module.exports = middlewareObj;