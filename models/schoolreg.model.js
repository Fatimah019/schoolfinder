const Mongoose=require('mongoose');

const Schema=Mongoose.Schema;

const schoolRegSchema=new Schema({
    schoolname:{type:String, required:"this field is required"},
    motto:{type:String, required:"this field is required"},
    fees:{type:String},
    hostelFacility:{type:String},
    address:{type:String, required:"this field is required"},
    location:{type:String, required:"this field is required"},
    state:{type:String, required:"this field is required"},
    email:{type:String, required:"this field is required"},
    website:{type:String},
    phone:{type:Number, required:"this field is required"},
    courses:{type:Array},
    profile:{type:String},
    img:{type:String}
});

schoolRegSchema.index({schoolname:"text", address:"text", location:"text", state:"text", courses:"text"})
module.exports=Mongoose.model('SchoolReg', schoolRegSchema);