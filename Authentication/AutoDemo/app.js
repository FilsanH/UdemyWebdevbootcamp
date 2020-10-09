var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),  // use to be able to req.body.name 
	User = require("./models/user"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose")



mongoose.connect('mongodb://localhost:27017/user_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var app = express()

//secret used to encode the data and secret used to decode info in the session 
app.use(require("express-session")({
	secret: "superhero",
	resave: false,
	saveUninitialized: false
	
}))

app.use(bodyParser.urlencoded({extended: true}));


	
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// =======
// ROUTES 






app.get("/", function(req, res){
	res.render("home");
})

// before render secrect check if the person is logged in 
app.get("/secret", isLoggedIn, function(req, res){
	res.render("secret");
})


//  Auth Routes  to show sign up form 

app.get("/register", function(req,res){
	res.render("register")
})

//handling user sign up  
app.get("/register", function(req, res){
   res.render("register"); 
});
//handling user sign up
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/secret");
        });
    });
});


// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("login"); 
});
//login logic
//middleware runs before call back  // process data and make sure credentials match 
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret", // if it works go to secert else back to login 
    failureRedirect: "/login"
}) ,function(req, res){
});

app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});


//passport destroys users data in the session 

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}





