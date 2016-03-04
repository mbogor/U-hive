'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

var baseUser = new mongoose.Schema({
  photo: {
    type: String,
    default: '/images/default-photo.jpg' //find default image later
  },
  isAdmin: {
    type: Boolean,
    default: false
  },

})
