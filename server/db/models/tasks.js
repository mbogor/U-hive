'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
var moment = require('moment');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: [String],
        required: true,
        enum: ['food', 'tutoring', 'delivery', 'moving', 'cleaning', 'other']
    },
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
    dateOffered: {
        type: Date,
        required: true
    },
    datePosted: {
        type: Date,
        default: new Date()
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
    datePurchased: {
        type: Date
    },
    forSaleOrWanted: {
        type: String,
        required: true,
        enum: ['forsale', 'wanted']
    }
});

taskSchema.methods.findSimilar = function() {
    return Task.find({category: {$in: this.category}, _id: {$ne: this._id}}).exec();
}

taskSchema.statics.findPriceRange = function(min, max){
    if(min < 0) min = 0;
    if(min >= max) max = min;
    return Task.find({price: {$gte: min, $lte: max}}).exec();
}

taskSchema.statics.getAllForSale = function(){
    return Task.find({forSaleOrWanted: 'forsale'}).exec();
}

taskSchema.statics.getAllWanted = function(){
    return Task.find({forSaleOrWanted: 'wanted'}).exec();
}

taskSchema.statics.newPosts = function(){
    var lastWeek = moment().subtract(7, 'days');
    return Task.find()
    .then(function(tasks){
        return Promise.filter(tasks, function(t){
            if(t.datePosted >= lastWeek) return t;
        });
    })
}

taskSchema.statics.clearOutDate = function(){
    return Task.remove({dateOffered: {$lte: Date.now()}}).exec()
}

taskSchema.plugin(deepPopulate);
mongoose.model('Task', taskSchema);

var Task = mongoose.model('Task');
