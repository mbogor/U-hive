'use strict';
var mongoose = require('mongoose');


var schema = new mongoose.Schema({

	reviewee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'},
	reviewer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	text: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		enum: [1, 2, 3, 4, 5]
	},
	task: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task'
	},
	reviewBy: {
		type: String,
		enum: ['Buyer', 'Seller']
	}

})


 mongoose.model('Review', schema);





