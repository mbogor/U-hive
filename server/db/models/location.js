'use strict';
var mongoose = require('mongoose');


var schema = new mongoose.Schema({

	city: {
		type: String,
		required: true,
		trim: true
	},
	state: {
		type: String,
		required: true,
		trim: true
	}

})
   

 mongoose.model('Location', schema);