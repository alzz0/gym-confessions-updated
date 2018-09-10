var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  post = require("./models/post"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds"),
  methodOverride = require("method-override"),
  flash = require("connect-flash");

var commentRoutes = require("./routes/comments.js");
var postRoutes = require("./routes/posts.js");
var indexRoutes = require("./routes/index.js");

mongoose.connect(
  "mongodb://alzz:operations9@ds151402.mlab.com:51402/gymconfessions"
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Crystal is something",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(commentRoutes);
app.use(indexRoutes);
app.use(postRoutes);

app.listen(process.env.PORT, process.env.IP, () =>
  console.log(" Server Has Started!")
);
