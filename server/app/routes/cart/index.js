'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
module.exports = router;


router.param('id', function(req, res, next){
  mongoose.model('Cart').findById(req.params.id)
  .then(function(cart){
    req.cart = cart;
    next();
  })
  .then(null, next);
})
//gets all carts
router.get('/', function(req, res, next) {
  mongoose.model('Cart').find()
  .then(function(carts){
    res.json(carts);
  })
  .then(null, next)
})

//get a cart
router.get('/:id', function(req, res, next){
  res.json(req.cart)
});

// post a new cart
router.post('/', function(req, res, next){
  // req.body = {buyer, tasks, etc}
  mongoose.model('Cart').create(req.body)
  .then(function(newCart){
    res.json(newCart);
  })
  .then(null, next);
});

// update a cart by adding a task
router.put('/:id/:taskId', function(req, res, next){

  // assumes req.body is includes only the updated fields from an update/edit form
  // AW: push returns the length of the array once the item has been added
  // repl: https://repl.it/BuTG
  // you probably don't want to do this 
  var tasks = req.cart.tasks.push(req.params.taskId);
  req.cart.tasks.set(tasks);
  req.cart.save()
  .then(function(updatedCart) {
    res.json(updatedCart);
  })
})

//remove one item from a cart
router.put('/:id/remove/:taskId', function(req, res, next){
  req.cart.update({$pull: {tasks: req.params.taskId } })
  .then(function(item) {
    res.sendStatus(204);
  })
  .then(null, next);
})

// delete a cart by id
router.delete('/:id', function(req, res, next){
  req.cart.remove()
  .then(function(){
    res.sendStatus(204)
  })
  .then(null, next);
})

