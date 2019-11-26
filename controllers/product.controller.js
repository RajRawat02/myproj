const Product = require('../models/product.model');
const User = require('../models/user.model');
exports.test = function(req,res){
  res.send('Greeting from the Test controller!');
}

exports.product_create = function(req,res){
console.log("$$$$$$$$$$$$$$"+req);
let product = new Product({
  name:req.body.name,
  price:req.body.price
})
product.save(function(err){
  if(err){
    return next(err);
  }
  res.send('Product Created Successfully');
});
}

exports.product_details = function(req,res){
  console.log("$$$$$$$$$$"+req.params.id);
  Product.findById(req.params.id,function(err,product){
    if(err)
    return next(err);
    res.send(product);
  });
}

exports.product_update = function(req,res){
  Product.findByIdAndUpdate(req.params.id,{$set :req.body},
    function(err,product){
      if(err)
      return next(err);
      res.send('Product Updated');
    });
}

exports.product_delete = function(req,res){
  Product.findByIdAndRemove(req.params.id,function(err){
    if(err)
    return next(err);
    res.send('Deleted Successfully');
  });
};

exports.login = function(req,res,next){
// confirm that user typed same password twice
if (req.body.password !== req.body.passwordConf) {
  var err = new Error('Passwords do not match.');
  err.status = 400;
  res.send("passwords dont match");
  return next(err);
}

if (req.body.email &&
  req.body.username &&
  req.body.password &&
  req.body.passwordConf) {

  var userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  }

  User.create(userData, function (error, user) {
    if (error) {
      return next(error);
    } else {
      req.session.userId = user._id;
      return res.write('authenticated');
    }
  });

} else if (req.body.logemail && req.body.logpassword) {
  User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
    if (error || !user) {
      var err = new Error('Wrong email or password.');
      err.status = 401;
      return next(err);
    } else {
      req.session.userId = user._id;
      return res.redirect('authenticated');
    }
  });
} else {
  var err = new Error('All fields required.');
  err.status = 400;
  return next(err);
}
}

exports.profile = function(req,res,next){
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);
          } else {
            return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
          }
        }
      });
 }

 exports.logout = function(req,res,next){
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.status(200);
      }
    });
  }
 }

 exports.register = function(req, res){
  var password = req.body.password;
	var password2 = req.body.password2;

  if (password == password2){
    var newUser = new User({
  		name: req.body.name,
  		email: req.body.email,
  		username: req.body.username,
  		password: req.body.password
  	});

  	User.createUser(newUser, function(err, user){
  		if(err) throw err;
  		res.send(user).end()
  	});
  } else{
    res.status(500).send("{erros: \"Passwords don't match\"}").end()
  }
 }

//https://medium.com/createdd-notes/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359