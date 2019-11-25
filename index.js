const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const product = require('./Routes/product.route');

const app = express();
const mongoose = require('mongoose');
let dev_db_url ='mongodb://localhost:27017/myapp';

const mongoDB = dev_db_url;
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

app.use('/',product);

let port = 3000;

app.listen(port,()=>{
console.log('server is up and running on port number '+port);
});