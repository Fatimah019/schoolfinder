const express=require ("express");
const path=require('path');
const hooganMiddleware=require('hogan-middleware');
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const flash=require('connect-flash');
const dbConfig=require('./configure/config');
const expressValidator=require('express-validator');
const userRoute=require('./routes/user.route');

const myOwnMiddleware=(req, res, next)=>{
    console.log("middleware applied");
    next();
}
const app=express();

app.set('view engine', 'ejs');

app.use(flash());
app.use(cookieParser());
app.use(expressValidator());
app.use(session({
    secret:dbConfig.secret,
    cookie:{},
    resave:false,
    saveUninitialized:true
}));

app.use((req, res, next)=>{
    res.locals.success_Message=req.flash('success_Message');
    res.locals.failure_Message=req.flash('failure_Message');
    res.locals.validationFailure=req.flash('validationFailure');
    next();
})

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(myOwnMiddleware);
app.use('/', userRoute);

mongoose.connect(dbConfig.url,
{
    useNewUrlParser:true, useUnifiedTopology:true
}
)
.then(()=>{
    console.log("Successflly connected to the database");
}).catch(err=>{
    console.log(err);
});

app.get('/', (req, res)=>{
    res.send("express");
})
var port=process.env.PORT || 8080;
app.listen(port, ()=>{
    console.log("app running on port 8080")
});



module.exports=app;