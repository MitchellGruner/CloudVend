const express = require('express'),
	  app = express(),
	  mongoose = require('mongoose'),
	  bodyParser = require('body-parser'),
	  port = process.env.PORT || 3000,
	  Items    = require("./models/items"),
	  methodOverride = require('method-override'),
	  passport = require('passport'),
	  LocalStrategy = require('passport-local'),
	  User = require('./models/user'),
	  Comment = require('./models/comments'),
	  Profile = require('./models/profile');

// connect to mongoose.
// mongoose.connect('mongodb://localhost/final', {
mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true
}).then(() => {
	console.log('Connected to DB')
}).catch(error => {
	console.log(error.message)
});

// connect routes.
var commentRoutes = require("./routes/comments"),
	itemsRoutes = require("./routes/items"),
	indexRoutes = require("./routes/index"),
	profileRoutes = require("./routes/profile");

// connect app.get.
app.use(bodyParser.urlencoded({extended : false}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// configure passport authentication.
app.use(require("express-session")({
	secret: "secret",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

// requiring the routes.
app.use("/", commentRoutes);
app.use("/", itemsRoutes);
app.use("/", indexRoutes);
app.use("/", profileRoutes);

// function lets us know server is properly set up.
app.listen(port, () => {  
  console.log("Server Has Started");
});