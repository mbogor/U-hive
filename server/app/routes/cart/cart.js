'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
module.exports = router;


router.param('id', function(req, res, next){
  mongoose.model('Cart').findById(req.params.id)
  .then(function(cart){
    req.cart = cart;
    next()
  })
  .then(null, next);
})

//get a cart 
router.get('/:cartId', function(req, res, next){
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
router.put('/:cartId/:taskId', function(req, res, next){
  // assumes req.body is includes only the updated fields from an update/edit form
  req.cart.set(req.body.taskId);
  req.cart.save()
  .then(function(updatedCart)) {
    res.json(updatedCart);
  }
})

// delete a cart by id
router.delete('/:cartId', function(req, res, next){
  req.cart.remove()
  .then(function(){
    res.sendStatus(204)
  })
  .then(null, next);
})

