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
    phone: {
        type: String
    },
    //places you're willing to work at/you're selling to
    college: {
        type: Schema.Types.ObjectId,
        ref: 'College'
    },
    photo: {
        type: String,
        default: '/images/default-photo.jpg' //find default image later
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    //UCombs is the $ amount you have on your account
    uComb: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    twitter: {
        id: String,
        username: String,
        token: String,
        tokenSecret: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    }
});

//VIRTUAL FOR RATING









//STATIC METHODS
schema.methods.getCompletedTasks = function() {
    return mongoose.model('Task').find({user: this._id, completed: true});
}

// method to remove sensitive information from user objects before sending them out
schema.methods.sanitize =  function () {
    return _.omit(this.toJSON(), ['password', 'salt']);
};

schema.methods.getAggregateScore = function() {

    return Reviews.find({reviewee: this._id})
    .then(function(reviews) {
        var sum = reviews.reduce(function(initial, curr) {
            return initial + curr;
        })
        return sum/reviews.length;
    })
}

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

mongoose.model('User', schema);
