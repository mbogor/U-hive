'use strict';
var mongoose = require('mongoose');

var scores = [1, 2, 3, 4, 5];

var schema = new mongoose.Schema({

	reviewee: {
		type: Schema.Types.ObjectId, 
		ref: 'User'},
	reviewer: {type: Schema.Types.ObjectId, ref: 'User'},
	text: {
		type: String,
		required: true
	},
  score: {
    enum: scores
  }

})
   

 mongoose.model('Review', schema);