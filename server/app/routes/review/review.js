'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Review = mongoose.model('Review');
module.exports = router;

// Think about this?!?!?!!

router.param('id', function(req, res, next){
  Review.findById(req.params.id)
  .then(function(review){
    req.review = review;
    next();
  })
  .then(null, next);
})

// get all tasks
router.get('/', function(req, res, next){
  Task.find({})
  .then(function(tasks){
    res.json(tasks);
  })
  .then(null, next)
})

//get one by id
router.get('/:id', function(req, res, next){
  res.json(req.task)
});

// post one task
router.post('/', function(req, res, next){
  Task.create(req.body)
  .then(function(newTask){
    res.json(newTask);
  })
  .then(null, next);
});

// update a task
router.put('/:id', function(req, res, next){
  req.task.set(req.body); //set is synchronous!!! look out for extra fields on req.body
  req.task.save()
  .then(function(updatedT){
    res.json(updatedT);
  })
  .then(null, next);
})

// delete task by id
router.delete('/:id', function(req, res, next){
  req.task.remove()
  .then(function(){
    res.sendStatus(204)
  })
  .then(null, next);
})