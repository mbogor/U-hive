'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose')
var User = mongoose.model('User');
var Task = mongoose.model('Task');
var College = mongoose.model('College')


var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};
router.param('id', function(req, res, next){
    User.findById(req.params.id).populate('college').exec()
    .then(function(user){
        req.reqUser = user;
        next();
    })
    .then(null, next);
});

router.get('/', function(req, res, next) {
    User.find({})
    .then(function(users){
        res.json(users);
    })
    .then(null, next);
})


router.get('/:id', function(req, res, next) {
    res.json(req.reqUser);
})

router.get('/:id/averagerating', function(req, res, next) {
    req.reqUser.getAggregateScore()
    .then(function(score){
        res.json(score);
    })
    .then(null, next)
})

router.get('/:id/reviews', function(req, res, next) {
    req.reqUser.getReviews()
    .then(function(reviews){
        res.json(reviews);
    })
    .then(null, next)
})


// router.get('/:id/tasks', function(req, res, next){
//     Tasks.find({})
// })



router.post('/', function(req, res, next) {
    User.create(req.body)
    .then(function(user) {
        res.status(201).json(user)
    })
    .then(null, next)
})

router.put('/:id', function(req, res, next){
    req.reqUser.set(req.body);
    req.reqUser.save(function(user){
        res.json(user);
    })
    .then(null, next);
})

router.delete('/:id', function(req, res, next){
    //can we check on findByIdAndRemove and any extra validation that might be necessary?
    req.reqUser.remove()
    .then(function(){
        res.sendStatus(204)
    })
    .then(null, next)
})

// router.get('/:id/history', function(req, res, next) {
//     User.findById(req.params.id)
//     .populate(Task)

// })
