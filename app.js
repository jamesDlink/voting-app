var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    config = require('./config'),
    Poll = require("./models/poll"),
    Answer = require("./models/answer"),
    seedDB = require('./seed'),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    passport = require('passport'),
    LocalStrategy = require("passport-local"),
    User = require('./models/user');

    
 
 
 
//Routes
var indexRoutes = require('./routes/index'),
    pollsRoutes = require('./routes/polls');


//Database
mongoose.connect(config.db.url,function(err){
    if(err){
        throw err;
    }
    console.log('Connected to database : '+config.db.name);
})

//App configurations
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride("_method"));


//Authentication
app.use(require("express-session")({
    secret:"secret",
    resave:false,
    saveUninitialized:false
}))


//Seed DB
seedDB();


//Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Set user
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})


//Routes to use
app.use(indexRoutes);
app.use("/polls",pollsRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log('Listening to port: '+process.env.PORT);
})