var express = require("express"),
    router = express.Router(),
    Poll = require('../models/poll'),
    Answer = require('../models/answer'),
    middlewareObj = require("../middleware/index");

    
//Index
router.get('/',function(req,res){
    Poll.find({},function(err,data){
        if(err){
            console.log(err);
            res.send("Error loading polls from database.")
        }
        res.render('polls/polls',{polls:data});
    })
})

//New
router.get("/new",middlewareObj.isLoggedIn,function(req,res){
    res.render('polls/new');
})

//Create 
router.post("/",middlewareObj.isLoggedIn,function(req,res){
    var poll = req.body.poll;
    var answers = poll.answers;
    var answersObjects = [];
    console.log(answers);
    if(answers!=""){
     answers = answers.toString().split(',');
    answers.forEach((element)=>{
        var newAnswer = new Answer({
            answer:element,
            votes:0
        })
        newAnswer.save();
        answersObjects.push(newAnswer);
    })
    }
    
    var newPoll = new Poll({
        name:poll.name,
        creator:{
            id:req.user._id,
            username:req.user.username
            },
        totalVotes:0,
        answers:answersObjects
    });
    
    newPoll.save(function(err){
        if(err)
            console.log(err);
        res.redirect("/polls");
    })
    
})


//Show
router.get('/:id',function(req,res){
    var id = req.params.id;
    Poll.findById(id).populate('answers').exec(function(err,poll){
        if(err){
            res.redirect('/polls');
            console.log("Poll not found by the given id.");
        }
        res.render("polls/show",{poll:poll});
    })
})

//Vote
router.post('/:id',function(req,res){
    var id = req.params.id,
        voted = req.body.voted;

    Poll.findById(id).populate('answers').exec(function(err,poll){
        if(err){
            console.log(err);
            res.redirect('/polls');
        }
        var answers = poll.answers;
        
        console.log("Voted: "+voted);
        
        //Search for the voted answer index so i can get its id later.
        var index = 0;
        while(index<answers.length && answers[index].answer != voted){
            index++;
        }
        
        var answerId = answers[index]._id;
        
        //Once I get answer's ID, i can search for it an update it.
        Answer.findByIdAndUpdate(answerId,{$inc:{'votes':1}},function(err,data){
            if(err){
                console.log(err);
                res.redirect("/polls");
            }
            console.log('Answer: '+data.answer+" voted, from poll: "+poll);
            
            //Add a vote to the poll.
            //************ Creo que es mala practica, tendria que hacer findbyidandupdate pero ya tengo referencia.
            poll.totalVotes++;
            poll.save();
            
            
            res.redirect('/polls/'+req.params.id);
            
        })

    })
})

//Delete
router.delete("/:id",middlewareObj.checkPollOwner,function(req,res){
    Poll.findByIdAndRemove(req.params.id,function(err,data){
        if(err){
            console.log(err);
            res.redirect("/polls");
        }
        console.log("Poll \""+data.name+"\" removed.");
        
        data.answers.forEach((answer_id)=>{
            Answer.findByIdAndRemove(answer_id,function(err){
                if(err)
                    console.log(err);
            })
        })
        res.redirect("/polls");
    })
})

//Edit 
router.get("/:id/edit",middlewareObj.checkPollOwner,function(req,res){
   Poll.findById(req.params.id).populate('answers').exec(function(err,data){
       if(err){
           console.log(err);
           res.redirect("/polls");
       }
       res.render("polls/edit",{poll:data});
   }) ;
});

//Update
router.put("/:id",middlewareObj.checkPollOwner,function(req,res){
    
    var answers = req.body.poll.answers;
    var answersObjects = [];
    if(answers!=""){
     answers = answers.toString().split(',');
    answers.forEach((element)=>{
        var newAnswer = new Answer({
            answer:element,
            votes:0
        })
        newAnswer.save();
        answersObjects.push(newAnswer);
    })
    
    }
    
    Poll.findById(req.params.id).populate('answers').exec(function(err,poll){
        if(err){
            console.log(err);
            res.redirect("/polls");
        }
        
        
        //Remove old answers
        poll.answers.forEach((oldAnswer)=>{
            oldAnswer.remove(function(err){
                if(err)
                    console.log(err);
            })
        })

        
        
        poll.set({
            answers:answersObjects,
            name:req.body.poll.name,
            creator:req.body.poll.creator,
            totalVotes:0
        });
      
    
        poll.save(function(err){
            if(err){
                console.log(err)
                res.redirect("/polls");
            }
            res.redirect("/polls/"+req.params.id);
        })
    })
});




module.exports = router;