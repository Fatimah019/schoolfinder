const jwt=require('jsonwebtoken');
const config=require('../configure/config');
const multer=require('multer');
const {User, Comment, Course, SchoolReg}=require('../models');


//token verification
exports.ifLoggedIn=async (req, res, next)=>{
    var token=req.body;
    if(!token){
        req.flash('failure_Message', "Access denied, signup first");
        return res.redirect('/signup');
    }
    try{
        const decoded=jwt.verify(token, config.secret);
        req.user=decoded.user;
        next();
    }catch(err){
        console.log(err);
        res.status(500).send({message:"Invalid Token"})
    }
}



    const storage=multer.memoryStorage();

    const filter=(req, file, cb)=>{
        if(file.mimetype === 'image/jpeg' || file.mimetype==='image/png' || file.mimetype.startsWith('image')){
            cb(null, true);
        }
        else{
            cb(null, false);
        }
    }
    const upload=multer({
        storage:storage,
        fileFilter:filter
    })

    exports.uploadSchoolPhoto=upload.single('image');