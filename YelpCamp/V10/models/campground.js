var mongoose= require("mongoose")



mongoose.connect('mongodb://localhost:27017/camp_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({

	name: String,
	image: String,
	price: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],

	author:{
		id: {
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String,}
	
})

//trigged when campground is removed then removes its comments also 

const Comment = require('./comments');
campgroundSchema.pre('remove', async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});


var Campground = mongoose.model("Campground", campgroundSchema);



module.exports = Campground