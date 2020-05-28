const Mongoose=require('mongoose');

const Schema=Mongoose.Schema;

const usersSchema=new Schema({
    title:{type:String, required:"Last name is required"},
    fullname:{type:String, required:"First name is required"},
    phoneNumber:{type:String, required:"Last name is required"},
    email:{type:String, required:"Email is required"},
    password:{type:String, required:"Password is required"},
    adminSecretCode:{type:String}
});

module.exports=Mongoose.model('User', usersSchema);
