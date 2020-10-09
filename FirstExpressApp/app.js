var express = require("express");
var app = express()

app.get("/", function(req, res){
	res.send("hi three!");
})


app.get("/dog", function(req, res){
	res.send("hi doojjjqskadnkwjndanogs here");
})

app.get("/speak/:string/:string2", function(req, res){
	console.log(req.params);
	res.send("hi byeeeeee");
})


app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});