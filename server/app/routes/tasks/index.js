'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Task = mongoose.model('Task')
var User = mongoose.model('User')
var Auth = require('../../configure/auth-middleware');
var Cart = mongoose.model('Cart');
module.exports = router;

router.param('id', function(req, res, next){
  Task.findById(req.params.id)
  .then(function(t){
    req.task = t;
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
  .then(null, next);
});

router.get('/forsale', function(req, res, next){
  var t, u, s;
  Task.getAllForSale()
  .then(function(tasks){
    res.json(tasks);
  })
  .then(null, next);
});

//find buyer of a task
// router.get('/:id/buyer', function(req, res, next){
//   Cart.findOne({tasks: { $in: [req.task]} }).populate('buyer').exec()
//   .then(function(buyer){
//     res.json(buyer);
//   })
//   .then(null, next);
// })

//get one by id
router.get('/:id', function(req, res, next){
  res.json(req.task);
});

// post one task
router.post('/', function(req, res, next){
  console.log('task req.body', req.body)
  Task.create(req.body)
  .then(function(newTask){
    console.log('created new task', newTask)
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
router.delete('/:id', Auth.assertAdminOrAuthor, function(req, res, next){
  console.log('auth function', Auth.assertAdminOrAuthor)
  // console.log('user on req', req.task.seller)
  // console.log('req.task', req.task)
  // console.log('isAdmin', req.task.seller.isAdmin)
  // console.log('req.task.seller', req.task.seller)
  req.task.remove()
  .then(function(){
    res.sendStatus(204)
  })
  .then(null, next);
})

//get a users forsale tasks

router.get('/forsale/:sellerId', function(req, res, next){
  Task.find({seller: req.params.sellerId, forSaleOrWanted: 'forsale',
    completed: false })
  .then(function(tasks){
    res.json(tasks);
  })
  .then(null, next);
});




