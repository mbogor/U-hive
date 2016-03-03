'use strict';
var mongoose = require('mongoose');

//  sballan Does this need to be its own Schema? Reasons for and against
var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

mongoose.model('Category', categorySchema);
