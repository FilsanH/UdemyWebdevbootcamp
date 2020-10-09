var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose= require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comments")
var seedDB = require("./seed"),
	User = require("./models/users"),
	LocalStrategy = require("passport-local"),
	passport = require("passport"),
	passportLocalMongoose = require("passport-local-mongoose")

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")
	


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

mongoose.connect('mongodb://localhost:27017/camp_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

seedDB()

// PASSPORT CONFIGURATION 
app.use(require("express-session")({
		secret: "Once upon a time not long ago I was a ",
		resave: false,
		saveUninitialized: false, 
		}))


app.use(passport.initialize())
app.use(passport.session())


passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// We want to be able to acess req.user everywhere so create a middleware fucntion  by putting it in res.local can see everywhere this middel ground runs for every route 

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next()
	
})
	

// get rid of all repetiions in /
app.use(indexRoutes),
app.use("/campgrounds/:id/comments/",  commentRoutes)
app.use("/campgrounds", campgroundRoutes)

app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});