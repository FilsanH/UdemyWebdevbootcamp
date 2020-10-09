
var express = require("express")
var router = express.Router(),
	User = require("../models/users"),
	passport = require("passport")





router.get("/", function(req, res){
	res.render("landing");
})

//AUTH Routes

//show register form 

router.get("/register", function(req,res){
	res.render("register")
})

//hanle sign up logic 

router.post("/register", function(req, res){
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

router.get("/login", function(req, res){
	res.render("login")
})

//login logic
//middleware runs before call back  // process data and make sure credentials match 
//middleware takes req.body.username and password and checks if its correct then authenticates 

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds", // if it works go to secert else back to login 
    failureRedirect: "/login"
}) ,function(req, res){
	//call back enpyt doesnt do anything 
});
 


router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router








