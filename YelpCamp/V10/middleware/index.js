var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");


// all the middleare goes here
var middlewareObj = {};

//athentication first- check if looged in then authorization-check rights/ownerhip before deleting 
//seeing as its middleware can use next and redirect back to continue to callback or return to current page 

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err || !foundCampground){
			req.flash("error", "Campground not found")

               res.redirect("back");
           }  else {
               // does user own the campground?

            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "You did not own the Campground")

                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
			  console.log(err)
			 req.flash("error", "Comment does not exist")
             res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
			    req.flash("error", "You do not own this comment")

                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "Please Login First!")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
		//here next means move onto the callback fucntion 

    if(req.isAuthenticated()){
		console.log("i have lo")
        return next();
    }
		req.flash("error", "Please Login First!") // shows up on next page/ request so need to handle it in /login
    res.redirect("/login");
}

module.exports = middlewareObj;