'use strict';
var mongoose = require('mongoose');


var schema = new mongoose.Schema({

	user: {
		type: Schema.Types.ObjectId, 
		ref: 'User'},
	reviewer: {type: Schema.Types.ObjectId, ref: 'User'},
	text: {
		type: String,
	},
	rating: {
		type: Number,
		enum: [1, 2, 3, 4, 5]
	}

})
   

 mongoose.model('Review', schema);