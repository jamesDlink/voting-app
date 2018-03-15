var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
    
var AnswerSchema = new Schema({
    answer:{
        type:String,
    },
    votes:{
        type:Number,
        default:0
    }
    
})

module.exports = mongoose.model('Answer',AnswerSchema);