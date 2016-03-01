'use strict';

var mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'},
  tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
  timeCreated: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Cart', cartSchema);
