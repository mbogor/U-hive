'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({

	name: {
		type: String,
		required: true,
		trim: true,
	},
	location: {type: String, required: true},
	streetAddress: {
    type: String,
    required: true
	},
	zipCode: {
    type: Number,
    required: true
	}
})



mongoose.model('College', schema);
