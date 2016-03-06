'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
module.exports = router;

// get all colleges
router.get('/', function(req, res, next){
  mongoose.model('College').find()
  .then(function(colleges){
    res.json(colleges);
  })
  .then(null, next);
});
