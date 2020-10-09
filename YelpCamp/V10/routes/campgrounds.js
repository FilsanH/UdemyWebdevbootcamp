var express = require("express")
var router = express.Router() //needed for ids that were once in url 
var Campground = require("../models/campground")
var middleware = require("../middleware");




// INDEX  - snow all campgrounds so getting info from database 
router.get("/",  function(req,res){
	Campground.find({}, function(err,allcampgrounds){
	if(err){
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

router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name
	var image = req.body.image
	var price = req.body.price
	var des = req.body.description
	
		var author = {
		id: req.user._id,
		username: req.user.username
	}

	var newCampground = {name:name, image:image, description:des, author:author, price:price}
	// create new campground and save to DB

 	
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err)
			
		} else{
				//res.send(" you have reached here yaaay")
		req.flash("success", "Campground Created")

		res.redirect("/campgrounds")
		}
	});

})

// NEW Route - show form to create campground  
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new.ejs")
	
})


// SHOW route - show info about one campground 
router.get("/:id", function(req,res){
	//find the campground with provided ID
	//use mongoose method called FindById this takes in the id and a callback function the call back functions arguments are the info that is returned from the method so baiscially what we see is the the output of our 
	// find campground and populate comment into campground by id so now foundcampground will have ids 
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err || !foundCampground){
			req.flash("error", "Campround not found")
			res.redirect("back")
		}else{
			//console.log(foundCampground)
			//render show template with that campgorund 
			res.render("campgrounds/show", {campground: foundCampground})
		}
	})

})


// EDIT Campground Route 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
		Campground.findById(req.params.id, function(err, foundCampground){
		if (err){
			console.log(err)
			res.redirect("/campgrounds")
		}else{
			//console.log(foundCampground)
			//render show template with that campgorund 
			res.render("campgrounds/edit", {campground: foundCampground})
		}
	})
	
})

//UPDATE CAMPGROUND

router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	//find and update the correct campground 
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
								 if(err){
									 res.redirect("/campgrounds");
									 
								 }else {
									 //to show page 
									 req.flash("success", "Comment Updated")

									 res.redirect("/campgrounds/" + req.params.id);
								 
		
	}
	})
})

///Destroy route delete campground need to use _method for delete in a form so button goes in a form 

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
		req.flash("success", "Comment Deleted")

          res.redirect("/campgrounds");
      }
   });
});





// ========================

module.exports = router