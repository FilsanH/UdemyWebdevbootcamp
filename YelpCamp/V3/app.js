var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose= require("mongoose")
var Campground = require("./models/campground")
var seedDB = require("./seed")




app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

mongoose.connect('mongodb://localhost:27017/camp_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

seedDB()

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
		
	res.render("index", {campgrounds: allcampgrounds})
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
	res.render("new.ejs")
	
})


// SHOW route - show info about one campground 
app.get("/campgrounds/:id", function(req,res){
	//find the campground with provided ID
	//use mongoose method called FindById this takes in the id and a callback function the call back functions arguments are the info that is returned from the method so baiscially what we see is the the output of our 
	// find campground and populate comment into campground by id so now foundcampground will have ids 
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err){
			condole.log(err)
		}else{
			//console.log(foundCampground)
			//render show template with that campgorund 
			res.render("show", {campground: foundCampground})
		}
	})

})


app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});