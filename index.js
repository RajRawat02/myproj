const express = require('express');
const bodyParser = require('body-parser');

const product = require('./Routes/product.route');

const app = express();
const mongoose = require('mongoose');
let dev_db_url ='mongodb://localhost:27017/myapp';

const mongoDB = dev_db_url;
mongoose.connect('mongodb://localhost:27017/myapp', {useUnifiedTopology: true,useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB Connection Error'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use('/products',product);

let port = 3000;

app.listen(port,()=>{
console.log('server is up and running on port number '+port);
});