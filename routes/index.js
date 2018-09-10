var express = require('express');
var router  = express.Router({mergeParams: true});
var passport = require('passport');
var User = require('../models/user');

//============//
//  Homepage
//============//
router.get("/", function(req, res){
    res.redirect("posts"); // res.render("landing") for home page...
});




//=====================
// Authentication
//=====================

router.get('/register', function(req, res){
   res.render('register'); 
});

//handle sign-up register logic
router.post('/register', function(req, res){
        var newUser = new User({username: req.body.username}); // Note password NOT in new User
       User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message)
            return res.redirect('/register');
        }else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success","Welcome to gym confessions"+user.username)
                res.redirect('/posts');
            });
        }
    }); 
});

router.get('/login', function(req, res){
   res.render('login'); 
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/posts",
    failureRedirect: "/login"
}), function(req, res){
  
});

//logout route

router.get('/logout', function(req, res){
    req.logout();

      req.flash("success","logged you out")
    res.redirect('/login');
});



module.exports = router;