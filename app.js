const express = require('express'),
	  app = express(),
	  mongoose = require('mongoose'),
	  bodyParser = require('body-parser'),
	  port = process.env.PORT || 3000,
	  Items = require("./models/items"),
	  methodOverride = require('method-override'),
	  passport = require('passport'),
	  LocalStrategy = require('passport-local'),
	  User = require('./models/user'),
	  Comment = require('./models/comments'),
	  Profile = require('./models/profile');

		require('dotenv').config();

		flash = require('connect-flash');
		helmet = require('helmet');
		session = require('express-session');
		MongoStore = require("connect-mongo");
		middleware = require('./middleware/index');


// connect to database.
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('Connected to DB');
}).catch(error => {
	console.log(error.message);
});


// connect routes.
var commentRoutes = require("./routes/comments"),
	itemsRoutes = require("./routes/items"),
	indexRoutes = require("./routes/index"),
	profileRoutes = require("./routes/profile");


// connect app.get.
app.use(
	helmet.contentSecurityPolicy({
	  directives: {
		defaultSrc: ["'self'"],
		scriptSrc: [
		  "'self'",
		  "https://code.jquery.com",
		  "https://stackpath.bootstrapcdn.com",
		  "https://maxcdn.bootstrapcdn.com"
		],
		styleSrc: [
		  "'self'",
		  "'unsafe-inline'",
		  "https://stackpath.bootstrapcdn.com",
		  "https://cdnjs.cloudflare.com",
		  "https://fonts.googleapis.com",
		  "https://maxcdn.bootstrapcdn.com"
		],
		imgSrc: [
		  "'self'",
		  "data:",
		  "https://images.unsplash.com",
		  "https://plus.unsplash.com"
		],
		fontSrc: [
		  "'self'",
		  "https://fonts.gstatic.com"
		]
	  }
	})
  );

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// SESSION STORE (MongoDB)
const store = MongoStore.create({
	mongoUrl: dbUrl,
	secret: 'thisshouldbeabettersecret!',
	touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
	console.log("SESSION STORE ERROR", e);
});


// SESSION CONFIG
const sessionConfig = {
	store,
	name: 'session',
	secret: 'thisshouldbeabettersecret!',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	}
};


// configure sessions (ONLY ONCE)
app.use(session(sessionConfig));


// configure passport authentication.
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// custom middleware
app.use(middleware.setCurrentUser);

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});


// requiring the routes.
app.use("/", commentRoutes);
app.use("/", itemsRoutes);
app.use("/", indexRoutes);
app.use("/", profileRoutes);


// flash messages
app.use(flash());


// function lets us know server is properly set up.
app.listen(port, () => {
	console.log("Server Has Started");
});