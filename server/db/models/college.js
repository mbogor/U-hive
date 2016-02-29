'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({

	name: {
		type: String,
		required: true,
		trim: true
	},
	location: [{type: Schema.Types.ObjectId, ref: 'Location'}]

})
   


mongoose.model('College', schema);