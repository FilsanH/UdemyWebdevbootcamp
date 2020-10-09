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

app.get("/", function(req, res){
	res.render("landing");
})


// Campground.create({
// 	name: "Filsan Creek",
// 	image: "https://www.photosforclass.com/download/px_699558",
// 	description: "Its raining"
// }, function(err, camp){
// 	if(err){
// 		console.log("error found")
// 		console.log(err)
// 	}else{
// 		console.log(camp)
// 	}
// })

// 	// var campgrounds = [
	
// 	// 	{ name: "Salmon ", image: "https://www.photosforclass.com/download/px_699558"},
// 	// 	{ name: "hill", image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 	// 	{name: "hounslow", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 	// 	{name: "hounslow", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"},{name: "hounslow", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"},{name: "hounslow", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"},{name: "hounslow", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"},
				
// 	// ]
	
	
// // Campground.create([
	
// // 		{ name: "Salmon ", image: "https://www.photosforclass.com/download/px_699558", description:"Lots of Space "},
// // 		{ name: "hill", image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350", description: " He has no lips"},
					
// // 	]), function(err, camps){
// // 	if(err){
// // 		console.log(err)
// // 	}
// // 	else{
// // 		console.log(camps)
// // 	}
// // }
	

	// INDEX  - snow all campgrounds so getting info from database 
app.get("/campgrounds", function(req,res){
	Campground.find({}, function(err,allcampgrounds){
	if(err){x
		console.log("oh no errror")
		console.log(err)
	}
	else {
		
	res.render("campgrounds/index", {campgrounds: allcampgrounds})
		console.log("all camps")
		console.log(allcampgrounds)
	}
})
	
})

// Create Route - add new campgorund  to database so form submits to this 


app.post("/campgrounds", function(req, res){
	var name = req.body.name
	var image = req.body.image
	var des = req.body.description
	var newCampground = {name:name, image:image, description:des}
	// create new campground and save to DB
	
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err)
			
		} else{
				//res.send(" you have reached here yaaay")
	res.redirect("/campgrounds")
		}
	});

})

// NEW Route - show form to create campground  

app.get("/campgrounds/new", function(req,res){
	res.render("campgrounds/new.ejs")
	
})


// SHOW route - show info about one campground 
app.get("/campgrounds/:id", function(req,res){
	//find the campground with provided ID
	//use mongoose method called FindById this takes in the id and a callback function the call back functions arguments are the info that is returned from the method so baiscially what we see is the the output of our 
	// find campground and populate comment into campground by id so now foundcampground will have ids 
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err){
			console.log(err)
		}else{
			//console.log(foundCampground)
			//render show template with that campgorund 
			res.render("campgrounds/show", {campground: foundCampground})
		}
	})

})


// ========================

// coments routes 



app.get("/campgrounds/:id/comments/new", isLoggedIn,  function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

// prevent hacking here using postman 
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});


//AUTH Routes

//show register form 

app.get("/register", function(req,res){
	res.render("register")
})

//hanle sign up logic 

app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err,user){
		   if(err){
            console.log(err);
			console.log("hiiii")
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds");
		//note same code here as login but need to create user before logging them in 
        });
    });
	})


//show login form 

app.get("/login", function(req, res){
	res.render("login")
})

//login logic
//middleware runs before call back  // process data and make sure credentials match 
//middleware takes req.body.username and password and checks if its correct then authenticates 
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds", // if it works go to secert else back to login 
    failureRedirect: "/login"
}) ,function(req, res){
	//call back enpyt doesnt do anything 
});
 


app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
	//here next means move onto the callback fucntion 
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});