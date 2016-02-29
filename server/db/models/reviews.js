'use strict';
var mongoose = require('mongoose');


var schema = new mongoose.Schema({

	user: {
		type: Schema.Types.ObjectId, 
		ref: 'User'},
	reviewer: {type: Schema.Types.ObjectId, ref: 'User'},
	text: {
		type: String,
		required: true
	}

})
   

 mongoose.model('Review', schema);