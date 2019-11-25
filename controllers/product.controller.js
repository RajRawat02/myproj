const Product = require('../models/product.model');

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

}

//https://medium.com/createdd-notes/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359