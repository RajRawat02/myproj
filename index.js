const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const product = require('./Routes/product.route');
const passport = require('passport');
var cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp', {useUnifiedTopology: true,useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB Connection Error'));
db.once('open',function(){
    //we're connected!
});

app.use(session({
    secret:'work hard',
    resave:true,
    saveUninitialized:false,
    store: new MongoStore({
        mongooseConnection:db
    })
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

app.use(function(err,req,res,next){
    res.status(err.status || 500);
    res.send(err.message);
});

app.use(function(req,res,next){
    var err = new Error('file not found');
    err.status = 404;
    next(err);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use('/',product);

// app.get('/register',function(req,res){
//     var passport = req.body.passport;
//     var passport2 = req.body.passport2;

//     if(passport==passport2){
//         var newUser = new newUser({
//             name:req.body.name,
//             email:req.body.email,
//             username:req.body.username,
//             passport:req.body.passport
//         });

//         User.createUser(newUser,function(err,user){
//             if(err) throw err;
//             res.send(user).end()
//         });
//     } else{
//         res.status(500).send("{errors:\"Passwords don't match\"}").end()
//     }
// });

var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function(username,passport,done){
        User.getUserByUsername(username,function(err,use){
        if(err) throw err;
        if(!user){
            return done(null,false,{message:'Unknown user'});
        }

        User.comparePassword(passport,user.passport,function(err,ismatch){
            if(err) throw err;
     		if(isMatch){
     			return done(null, user);
     		} else {
     			return done(null, false, {message: 'Invalid password'});
     		}
        });
    });
    }
));

passport.serializeUser(function(user,done){
    done(null,user.id);
})

passport.deserializeUser(function(id,user){
    User.getUserById(id,function(err,user){
        done(err,user);
    });
});
let port = 3000;

app.listen(port,()=>{
console.log('server is up and running on port number '+port);
});