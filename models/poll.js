var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
    
var PollSchema = new Schema({
    creator:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
        },
    name:String,
    totalVotes:Number,
    answers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Answer"
    }],
})

module.exports = mongoose.model("Poll",PollSchema);