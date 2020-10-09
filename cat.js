
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var catSchema = new mongoose.Schema({
	name: String,
	age: Number, 
	tempermant: String,
})

var Cat = mongoose.model("Cat", catSchema);  //compile pattern into amodel this makes it have methods


Cat.create({
	name: "snow White",
	age:15,
	tempermant: "nice",
}), function(err, cat){
	if(err){
		console.log(err)
	}
	else{
		console.log(cat)
	}
}

//adding a new cat to the DB

// var george = new Cat({
// 	name: "george",
// 	age:11,
// 	tempermant: "sad"
// })

//retrive all cata from the DB
// george.save(function(err, cat){
// 	if (err){
// 		console.log("ssomething went wrong ")
// 	} else {
// 		console.log("we just saved a cat to the DB")
// 		console.log(cat);
// 	}
// });

Cat.find({}, function(err,cats){
	if(err){x
		console.log("oh no errror")
		console.log(err)
	}
	else {
		console.log("all cats")
		console.log(cats)
	}
})