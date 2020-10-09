var express = require("express")
var router = express.Router() //needed for ids that were once in url 
var Campground = require("../models/campground")



// INDEX  - snow all campgrounds so getting info from database 
router.get("/", function(req,res){
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

router.post("/", function(req, res){
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
router.get("/new", function(req,res){
	res.render("campgrounds/new.ejs")
	
})


// SHOW route - show info about one campground 
router.get("/:id", function(req,res){
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

module.exports = router