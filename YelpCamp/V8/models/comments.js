var mongoose= require("mongoose")



mongoose.connect('mongodb://localhost:27017/camp_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// SCHEMA SETUP
var commentSchema = new mongoose.Schema({
	author:{
		id: {
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
		
	},
	text: String, 
})
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment