'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
module.exports = router;

router.param('id', function(req, res, next){
  mongoose.model('Task').findById(req.params.id)
  .then(function(t){
    req.task = t;
  })
  .then(null, next);
  // sballan Genuinely curious - under what conditions is this next() called?
  next();
})

// get all tasks
router.get('/tasks', function(req, res, next){
  mongoose.model('Task').find({})
  .then(function(tasks){
    res.json(tasks);
  })
  .then(null, next)
})

//get one by id
router.get('/tasks/:id', function(req, res, next){
  res.json(req.task)
});

// post one task
router.post('/tasks', function(req, res, next){
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

  /*  sballan This is a useful way to do 'update' on an instance
    req.task.set(req.body)
    req.task.save()
  */

  req.task.update({$set: req.body}, {new: true})
  .then(function(updatedT){
    res.json(updatedT);
  })
  // sballan Add some error handling yo
})

// delete task by id
router.delete('/tasks/:id', function(req, res, next){
  req.task.remove()
  .then(function(){
    res.sendStatus(204)
  })
  .then(null, next);
})
