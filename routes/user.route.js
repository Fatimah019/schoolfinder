const express=require("express");
const router=express.Router();
const user=require("../controller");
const auth=require("../middleware/auth");

//home page
router.get('/', (req, res)=>{
    res.render('home', null);
});

//register a user
router.get('/signup', (req, res, next)=>{
    res.render('signup', null);
}).post('/signup', user.signup);

//users login
//router.post('/login', user.Login);ch
router.get('/login', (req, res, next)=>{
    res.render('login', null);
}).post('/login', user.login);


//get registraion form
router.get('/registrationform', (req, res, next)=>{
    res.render('registrationform', null);
}).post('/registrationform', auth.uploadSchoolPhoto,  user.registerSchool);

//get all schools by query
router.get('/:search', user.getSchoolByQuery);

//get schools admin
router.get('/admin/dashboard', user.getSchoolsAdmin);

//profile page of registered schools
router.get('/school/dashboard', (req, res)=>{
    res.render('profilepage')
})

//get all schools general(not feasible)
//router.get('/schoollist', user.getSchoolsGeneral);


//delete ALL SCHOOLS
router.delete('/schools', user.deleteSchools);

module.exports=router;