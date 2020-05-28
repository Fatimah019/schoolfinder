const Mongoose=require('mongoose');

const Schema=Mongoose.Schema;

const commentsSchema=new Schema({
    title:{type:String, required:"First name is required"},
    comment:{type:String, required:"Last name is required"}
});

module.exports=Mongoose.model('Comments', commentsSchema);