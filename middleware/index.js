var Poll = require("../models/poll");


var middlewareObj = {};


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    
    res.redirect("/login");
}


middlewareObj.checkPollOwner = function(req,res,next){
    if(!req.isAuthenticated()){
        res.redirect("/login");
    }else{
        Poll.findById(req.params.id,function(err,poll){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                if(poll.creator.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }
}

module.exports = middlewareObj;