'use strict';
var mongoose = require('mongoose');

var cityState = ['New York City, NY'];

// sballan Should this be its own schema?

var schema = new mongoose.Schema({
	cityState: {
		type: String,
		required: true,
		trim: true,
		enum: cityState
	}
})


 mongoose.model('Location', schema);
