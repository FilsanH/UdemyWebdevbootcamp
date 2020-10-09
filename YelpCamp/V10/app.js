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
	passportLocalMongoose = require("passport-local-mongoose"),
		flash = require("connect-flash")


var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index"),
    methodOverride = require("method-override")

	


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")
var url = process.env.DATABASEURL || 'mongodb://localhost:27017/camp_app'


mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())

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



// We want to be able to acess req.user everywhere so can create a middleware fucntion  by putting it in res.local can see everywhere this middel ground runs for every route 
//req.user comes from passport 

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")


	next()
	
})
	

// get rid of all repetiions in /
app.use(indexRoutes),
app.use("/campgrounds/:id/comments/",  commentRoutes)
app.use("/campgrounds", campgroundRoutes)

 var port = process.env.PORT || 3000;
    app.listen(port, function () {
      console.log("Server Has Started!");
    });
