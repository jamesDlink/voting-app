var express = require("express"),
    router = express.Router(),
    User = require('../models/user'),
    passport = require("passport"),
    Poll = require("../models/poll");
    
//ROUTES FOR HOME, LOGIN ,REGISTER.
//Homepage
router.get('/',function(req,res){
    res.render('index/index');
})

//Register view
router.get("/register",function(req,res){
    res.render('index/register');
})

//Register user post
router.post("/register",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("index/register");
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/polls');
        })
        
    });
})

//Show login view
router.get("/login",function(req,res){
   res.render("index/login"); 
})

//Login user post
router.post('/login',passport.authenticate("local",
{
    successRedirect:"/polls",
    failureRedirect:"/login"
}),function(req,res){
})


//Logout
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})


//User polls
router.get("/user/:id",function(req,res){
    var id = req.params.id;
    User.findById(id,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/");
        }
        Poll.find({'creator.id':id},function(err,polls){
            if(err){
                console.log(err);
                res.redirect("/");
            }
            res.render("user/polls",{polls:polls,user:user
            });
        })
    })
})


module.exports = router;