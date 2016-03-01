'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({

	reviewee: {
		type: Schema.Types.ObjectId, 
		ref: 'User'},
	reviewer: {type: Schema.Types.ObjectId, ref: 'User'},
	text: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		enum: [1, 2, 3, 4, 5]
	}

})
   

 mongoose.model('Review', schema);