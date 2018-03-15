var mongoose = require("mongoose"),
    Poll = require("./models/poll"),
    Answer = require("./models/answer");
    
var answerArr = [
    {
        answer:"This is answer 1",
        votes:2
    },
    {
        answer:"This is answer 2",
        votes:4
    }
    ];


var pollArr = [
    {
        creator:"Nachi",
        name:"This is a poll example text asdadsad 123!",
        totalVotes:12
    },
    {
        creator:'nachito222',
        name:'Peñarol o nacional ?',
        totalVotes:4
    }
]




function seedDB(){
    //Clear polls/answers
    Poll.remove({},function(err){
        if(err)
            throw err;
        console.log('Polls removed.');
        Answer.remove({},function(err){
            if(err)
                throw err;
            console.log('Answers removed.');
        
            
            })
        
        })
}

module.exports = seedDB;