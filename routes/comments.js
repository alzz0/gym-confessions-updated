var express = require('express');
var router  = express.Router({mergeParams: true});
var Post = require('../models/post');
var Comment = require('../models/comment');
var middleware =require("../middleware/index.js"); // dont need to add index will automaticly require index if file is called index.

// ====================
// COMMENTS ROUTES
// ====================

router.get("/posts/:id/comments/new", middleware.isLoggedIn, function(req, res){
    // find post by id
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {post: post});
        }
    })
});

router.post("/posts/:id/comments", middleware.isLoggedIn, function(req, res){
   //lookup post using ID
   Post.findById(req.params.id, function(err, post){
       if(err){
           req.flash("error","something went wrong")
           res.redirect("/posts");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               console.log(comment);
               post.comments.push(comment);
               post.save();
            //   req.flash("success","added comment");
               res.redirect('/posts/' + post._id);
           }
        });
       }
   });
});


//edit comments routes

router.get("/posts/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
               res.render("comments/edit",{post_id:req.params.id,comment:foundComment}); 
        }
    });
});

//update comments route
router.put("/posts/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
       if(err){
       res.redirect("back");
   } else{
      res.redirect("/posts/"+ req.params.id)
   }
   })
});


//delete route

router.delete("/posts/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){

  Comment.findByIdAndRemove(req.params.comment_id,function(err){
      if(err){
          res.redirect("back");
           
      }else {
        //   req.flash("success","Comment deleted");
          res.redirect("back");
      }
  }) ;
});





module.exports = router;