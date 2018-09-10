
//middle ware
var Comment=require("../models/comment");
var Post=require("../models/post");
var middlewareOBJ={};



middlewareOBJ.checkCommentOwnership=function(req,res,next){{
        if(req.isAuthenticated()){
              Comment.findById(req.params.comment_id,function(err,foundComment){
          if(err){
              req.flash("error","post not found")
              res.redirect("back");
          }else{
             if(foundComment.author.id.equals(req.user._id)){
                  next();
             }else{
                 req.flash("error","No permission")
                 res.redirect("back")
             }
          }
          }) ;
    }else{
      res.redirect("back");
    }
}
}


middlewareOBJ.checkPostOwnership= function(req,res,next){
        if(req.isAuthenticated()){
              Post.findById(req.params.id,function(err,foundPost){
          if(err){
              res.redirect("back");
          }else{
             if(foundPost.author.id.equals(req.user._id)){
                  next();
             }else{
                 res.redirect("back");
             }
          }
          }) ;
    }else{
        req.flash("error","No permission")
      res.redirect("back");
    }

};

middlewareOBJ.isLoggedIn=function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Need to be logged in.");
    res.redirect('/login');

};

module.exports=middlewareOBJ;