const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('../configure/config');
const fs=require('fs');


//users model
const {User, Comment, Course, SchoolReg}=require('../models');

exports.signup=async (req, res)=>{
    //validate users input
    req.check('fullname', "name cannot be left blank").notEmpty();
    
    req.check('email', "make sure your email is in the right format").isEmail();
    
    req.check('password', "password should contain more than 5 characters").isLength({
        min:6,
        max:20
    });

    
    const errors=req.validationErrors()
    if(errors){
        const firstError=errors.map((error)=>error.msg)[0]
        req.flash('failure_Message', firstError);
        return res.redirect('/signup');    
    };

    const {title, fullname, email, password, phoneNumber, info}= req.body;
    try{
    
    let newuser= await User.findOne({email});
    if (newuser){
        req.flash('failure_Message', "User already exists");
        return res.redirect('/signup');
    }         
        user=new User({
            title,
            fullname,
            email,
            password,
            phoneNumber, 
            info
        });

        res.redirect('/login');
        req.flash('success_Message', "signed up successfully, now you may login");

        const salt=await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(password, salt);
        await user.save();
        const payload={
            userid:{id:user.id}
        };
        jwt.sign(
            payload,
            config.secret,{expiresIn:10000},
            (err, token)=>{
                if (err) throw err;
                res.status(200).json({
                    data:newuser,
                    auth:true,
                    token
                });
            })
    }catch(err){
        res.send(err);
    }
}

exports.login=async (req, res)=>{
    //check email
    req.check('email', "make sure your email is in the right format").isEmail();
    //password
    req.check('password', "password should contain more than 5 characters").isLength({
        min:6,
        max:20
    });

    //check for errors
    const errors=req.validationErrors()
    //if there is error , show this
    if(errors){
        const firstError=errors.map((error)=>error.msg)[0]
        req.flash('failure_Message', firstError); 
        return res.redirect('/login');     
    }

    const {email, password}=req.body;
    try{
    
    let user=await User.findOne({email});
    if (!user){
        req.flash('failure_Message', "User does not exist");
        return res.redirect('/login');
    }

    const validPassword=await bcrypt.compare(password, user.password);
    if(!validPassword){
        req.flash('failure_Message', "Incorrect password");
        return res.redirect('/login');
    }
    res.redirect('/registrationform');
    const payload={
        userid:{id:user.id}
    };
    jwt.sign(
        payload,
        config.secret,
        {expiresIn:3600},
        (err, token)=>{
            if (err) throw err;
            res.status(200).json({
                data:user,
                token
            })
        }
        )
    }catch(err){
        res.send(err);
    }
}


/*
//users signup
exports.signup=async (req, res, next)=>{
    req.check('fullname', "name cannot be left blank").notEmpty();
    
    req.check('email', "make sure your email is in the right format").isEmail();
    
    req.check('password', "password should contain more than 5 characters").isLength({
        min:6,
        max:20
    });
    
    const errors=req.validationErrors()
    if(errors){
        const firstError=errors.map((error)=>error.msg)[0]
        req.flash('failure_Message', firstError); 
        return res.redirect('/signup');   
    };

    const {title, fullname, email, phoneNumber, password, info, adminSecretCode}= req.body;

    try{
    let user= await User.findOne({email});
    if (user){
        req.flash('failure_Message', "User exists already");
        return res.redirect('/signup');
    }         
        user=new User({
            title,
            fullname,
            email,
            phoneNumber,
            password,
            info,
            adminSecretCode
        });

        req.flash('success_Message', "Signed up successfully, now you may login");
        res.redirect('/login');

        const salt=await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(password, salt);
        await user.save();
        const payload={
            userid:{id:user.id}
        };
        jwt.sign(
            payload,
            config.secret,{expiresIn:10000},
            (err, token)=>{
                if (err) throw err;
                res.status(200).json({
                    data:user,
                    auth:true,
                    token
                });
            })
    }catch(err){
        res.send(err);
    }
};

//users login
exports.login=async (req, res, next)=>{
    //check email
    req.check('email', "make sure your email is in the right format").isEmail();
    //password
    req.check('password', "password should contain more than 5 characters").isLength({
        min:6,
        max:20
    });

    //check for errors
    const errors=req.validationErrors()
    //if there is error , show this
    if(errors){
        const firstError=errors.map((error)=>error.msg)[0]
        req.flash('failure_Message', firstError); 
        return res.redirect('/login');     
    }

    const {email, password}=req.body;
    try{
    
    let user=await User.findOne({email});
    if (!user){
        req.flash('failure_Message', "User does not exist");
        return res.redirect('/login');
    }

    const validPassword=await bcrypt.compare(password, user.password);
    if(!validPassword){
        req.flash('failure_Message', "Incorrect password");
        return res.redirect('/login');
    }
    res.redirect('/registrationform');
    const payload={
        userid:{id:user.id}
    };
    jwt.sign(
        payload,
        config.secret,
        {expiresIn:3600},
        (err, token)=>{
            if (err) throw err;
            res.status(200).json({
                data:user,
                token
            })
        }
        )
    }catch(err){
        res.send(err);
    }
};
 
*/

//register a school
exports.registerSchool=async (req, res)=>{
    SchoolReg.create(req.body)
    .then(currentschool=>{
        req.flash('success_Message', "School Registered Successfully");
        //res.render('profilepage', {schoolinfo:currentschool})
        return res.redirect('/school/dashboard');//users profile
    }).catch(err=>{
        req.flash('failure_Message', "Provide Correct Information");
        return res.redirect('/registrationform');
    })
}

//get school by query by state
exports.getSchoolByQuery=async (req, res, next)=>{
    SchoolReg.find({$text:{ $search:req.query.search}})
    .then(schoolstate=>{
        res.render('schoollist', {schoolstates:schoolstate});
    }).catch(err=>{
        res.send("cannot get school list")
    })
    
}

//get all  in admin page
exports.getSchoolsAdmin=async (req, res)=>{
    SchoolReg.find()
    .then(schools=>{
        return res.render('admindashboard', {showAdminSchools:schools})
    }).catch(err=>{
        res.send(err);
    })
}

//get all schools(not feasible)
exports.getSchoolsGeneral=async (req, res)=>{
    SchoolReg.find()
    .then(schools=>{
        //res.send(schools)
        res.render('schoollist',{listOfSchoolgeneral:schools})
    }).catch(err=>{
        res.send(err);
    })
}

//schoolname:"text", address:"text", location:"text", state:"text", courses:"text"

//delete all schools
exports.deleteSchools=async (req, res)=>{
    SchoolReg.findOneAndDelete({state:req.params.state})
    .then(schools=>{
        res.send("deleted")
    }).catch(err=>{
        res.send(err)
    })
}

//get school profile by name
exports.getSchoolProfile=async (req, res, next)=>{
    SchoolReg.find({schoolname:req.params.schoolname})
    .then(profile=>{
        res.send(profile)
    }).catch(err=>{
        res.send(err)
    })
}





//add list of courses by school id
exports.coursesCreate=async (req, res)=>{
    Course.create(req.body)
    .then(coursedb=>{
        return SchoolReg.findOneAndUpdate({_id:req.params.id}, {$push:{courses:coursedb._id}}, {new:true})
    }).then(schooldb=>{
        res.json(schooldb);
    }).catch(err=>{
        res.json({
            "message":err
        })
    })
}
exports.bookLessons=async (req, res)=>{
    Lesson.create(req.body)
    .then(lessondb=>{
        return Subject.findOneAndUpdate({_id:req.params.id}, {$push:{lessons:lessondb._id}}, {new:true})
    }).then(subjectdb=>{
        res.json(subjectdb);
    }).catch(err=>{
        res.json({
            "message":"cannot update subject with lessons"
        })
    })
}

/*
//write a comment
exports.Comment=async (req, res)=>{
    Comment.create(req.body)
    .then(schooldb=>{
        return SchoolReg.findOneAndUpdate({_id:req.body.id}, {$push:{comments:schooldb._id}}, {new:true})
    }).then(schooldb=>{
        res.json(schooldb);
    }).catch(err=>{
        res.json({
            "message":"cannot update school with comment"
        })
    })
}
*/
