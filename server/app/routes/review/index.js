'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Review = mongoose.model('Review');
module.exports = router;

router.param('id', function(req, res, next){
  Review.findById(req.params.id)
  .then(function(review){
    req.review = review;
    next();
  })
  .then(null, next);
})

// get all reviews
router.get('/', function(req, res, next){
  Review.find({})
  .then(function(reviews) {
    res.json(reviews)
  })
  .then(null, next);
});

// get one review by id
router.get('/:id', function(req, res, next){
  res.json(req.review)
});

// post one review
router.post('/', function(req, res, next){
  Review.create(req.body)
  .then(function(newReview){
    res.json(newReview);
  })
  .then(null, next);
});

// update a review
router.put('/:id', function(req, res, next){
  req.review.set(req.body); 
  req.review.save()
  .then(function(updatedReview){
    res.json(updatedReview);
  })
  .then(null, next);
})

// delete review by id
router.delete('/:id', function(req, res, next){
  req.review.remove()
  .then(function(){
    res.sendStatus(204)
  })
  .then(null, next);
})

