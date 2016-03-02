'use strict';
var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    price: {
        type: Number,
        default: 0,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: '/default-image.png'
    },
    date: {
        type: Date,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    restrictedByCampus: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    purchased:{
        type: Boolean,
        default: false
    },
    forSaleOrWanted: {
        type: String,
        required: true,
        enum: ['forsale', 'wanted']
    }
});

mongoose.model('Task', taskSchema);
