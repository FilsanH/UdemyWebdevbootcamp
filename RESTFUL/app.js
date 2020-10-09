var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose= require("mongoose")
var methodOverride = require('method-override')



//APP CONFIG 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(methodOverride("_method"))

//set up mongoose model config 

mongoose.connect('mongodb://localhost:27017/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

mongoose.set('useFindAndModify', false);


// ceate instance of blog to store in mongodb

var blogSchema = new mongoose.Schema ({
	title: String,
	image: {type: String, default: "https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&h=350"},
	body: String,
	created: {type: Date, default: Date.now},
});


var Blog = mongoose.model("Blog", blogSchema)

// RESTFUL ROUTES 

// Blog.create({
// 		title: "boook",
// 	body: "this is a blog post",

// })

app.get("/", function(req, res){
	res.redirect("/blogs")
})

// INDEx route  list all blogs
app.get("/blogs", function(req, res){

	Blog.find({}, function(err, blogs){
			  if (err){
		console.log("ERROR1!")
	} else {
		res.render("index", {blogs: blogs })
		
		
	}
			  })
})



// NEW Route 

app.get("/blogs/new", function(req,res){
	res.render("new")
})



//Show route show infor about one particular dog 


app.get("/blogs/:id", function(req, res){
	
	Blog.findById(req.params.id, function(err, foundBlog){
			  if (err){
		console.log("ERROR!2")
	} else {
		console.log(foundBlog)
		res.render("show", {blog: foundBlog});
		
		
	}
			  })
})

//Edit Route 

app.get("/blogs/:id/edit", function(req, res){
	
		Blog.findById(req.params.id, function(err, foundBlog){
			  if (err){
		console.log("ERROR!2")
	} else {
		console.log(foundBlog)
		res.render("edit", {blog: foundBlog});
		
		
	}
	
}) })

//UPDATE route

app.put("/blogs/:id", function(req,res){
		Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
			  if (err){
		res.redirect("/blogs")
	} else {
		res.redirect("/blogs/" + req.params.id)
		
		
	}
	
}) 
	
})


// DELETE Route


app.delete("/blogs/:id", function(req, res){
			Blog.findByIdAndRemove(req.params.id, function(err){
			  if (err){
		res.redirect("/blogs")
	} else {
		res.redirect("/blogs/")
		
		
	}
	
}) 
})

//CREATE route create a new dog and then redirect somewhere
app.post("/blogs", function(req, res){
	//ceate blog 
	Blog.create(req.body.blog, function(err, newBlog){
		if (err){
		console.log("ERROR!3")
	} else {
		console.log("posted")
		res.redirect("/blogs")
		
		
	}
})
})

















app.listen(3001, function() { 
  console.log('Server listening on port 3000'); 
});