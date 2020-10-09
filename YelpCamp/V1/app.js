var express = require("express")
var app = express()
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

app.get("/", function(req, res){
	res.render("landing");
})


	var campgrounds = [
		{ name: "Salmon ", image: "https://www.photosforclass.com/download/px_699558"},
		{ name: "hill", image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350"},
		{name: "hounslow", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"},
		{name: "hounslow", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"},{name: "hounslow", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"},{name: "hounslow", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"},{name: "hounslow", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"},
				
	]
	
app.get("/campgrounds", function(req,res){
	

	res.render("campgrounds", {campgrounds: campgrounds})
	
})

app.get("/campgrounds/new", function(req,res){
	res.render("new.ejs")
	
})

app.post("/campgrounds", function(req, res){
	var name = req.body.name
	var image = req.body.image
	campgrounds.push({name: name, image: image})
	//res.send(" you have reached here yaaay")
	res.redirect("/campgrounds")
})



app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});