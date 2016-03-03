'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
module.exports = router;

router.param('id', function(req, res, next){
  mongoose.model('Cart').findById(req.params.id)
  .then(function(t){
    req.task = t;
    next()
  })
  .then(null, next);
})

// get / empty or otherwise

// put /post add task to cart

// delete item - remove items
// delete the full cart



//get one cart by id
router.get('/cart/:cartId', function(req, res, next){
  res.json(req.task)
});

// post one task
router.post('/cart/:taskId', function(req, res, next){
  // assumes req.body has all the required fields from a new-task form
  // req.body = {name, category, price ... etc}
  mongoose.model('Task').create(req.body)
  .then(function(newTask){
    res.json(newTask);
  })
  .then(null, next);
});

// update a task
router.put('/tasks/:id', function(req, res, next){
  // assumes req.body is includes only the updated fields from an update/edit form
  req.task.update({$set: req.body}, {new: true})
  .then(function(updatedT){
    res.json(updatedT);
  })
})

// delete cart by id
router.delete('/cart/:id', function(req, res, next){
  req.task.remove()
  .then(function(){
    res.sendStatus(204)
  })
  .then(null, next);
})
