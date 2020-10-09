var express = require("express")
var router = express.Router({mergeParams: true})
var Campground = require("../models/campground")
var Comment = require("../models/comments")
var middleware = require("../middleware");


// coments routes 



router.get("/new", middleware.isLoggedIn,  function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

// prevent hacking here using postman 
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   //add username and id to comment 
			   console.log(req.user.username)
			   comment.author.id = req.user._id
			   comment.author.username = req.user.username
			   comment.save()
               campground.comments.push(comment);
               campground.save();
			   console.log(comment)
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

//edit route:

router.get("/:comments_id/edit",middleware.checkCommentOwnership, function(req,res){
	//remeber id is in url so don't have to find by id as already have it in req.params
	Comment.findById(req.params.comments_id, function(err, foundComment){
		if(err){
			res.redirect("back")
		} else {
			console.log(foundComment.text)
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
		}
	})
	
})

// Comment Update 

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});


// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});
module.exports = router