var express = require('express');
var router  = express.Router({mergeParams: true});
var Post = require('../models/post');
var middleware =require("../middleware/index.js"); // dont need to add index will automaticly require index if file is called index..

//INDEX - show all posts
router.get("/posts", function(req, res){
    // Get all posts from DB
    Post.find({}, function(err, allPosts){
       if(err){
           console.log(err);
       } else {
          res.render("./posts/index",{
              posts:allPosts,
          });
       }
    });
});

//CREATE - add new posts to DB
router.post("/posts",middleware.isLoggedIn, function(req, res){
    // get data from form and add to posts array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var  author= {
        id:req.user._id,
        username:req.user.username
    };
    var newPost = {name: name, image: image, description: desc, author:author}
    
    // Create a new posts and save to DB
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to posts page
            console.log(newlyCreated);
            res.redirect("/posts");
        }
    });
});

//NEW - show form to create new posts
router.get("/posts/new",middleware.isLoggedIn, function(req, res){
   res.render("posts/new"); 
});

// SHOW - shows more info about one posts
router.get("/posts/:id", function(req, res){
    //find the posts with provided ID
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            //render show template with that posts
            res.render("posts/show", {post: foundPost});
        }
    });
});

//edit/update post route

router.get("/posts/:id/edit",middleware.checkPostOwnership,function(req,res){
              Post.findById(req.params.id,function(err,foundPost){
                  res.render("posts/edit",{post:foundPost});
    });
});



router.put("/posts/:id",middleware.checkPostOwnership,function(req,res){
   Post.findByIdAndUpdate(req.params.id,req.body.post,function(err,updatedPost){
       if(err){
           res.redirect("/");
       }else {
           res.redirect("/posts/"+req.params.id);
       }
   });
});


router.delete("/posts/:id",middleware.checkPostOwnership,function(req,res){
   Post.findByIdAndRemove(req.params.id,function(err,post){
       if(err){
           res.redirect("/");
       }else{
           res.redirect("/");
       }
   });
});



module.exports = router;