'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var _ = require('lodash');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Promise = require('bluebird');

// var Score = require('Score')
var baseUserSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: false
  }
});

baseUserSchema.methods.getCart = function() {
    return mongoose.model('Cart').findOne({guest: this._id, processed: false})
    .populate('tasks')
    .then(function(cart){
        return cart;
    })
}


mongoose.model('baseUser', baseUserSchema);



var authUserSchema = baseUserSchema.extend({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    phone: {
        type: String
    },
    //places you're willing to work at/you're selling to
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    },
    streetAddress: {
        type: String
    },
    salt: {
        type: String
    },
    accountCreated: {
        type: Date,
        default: Date.now()
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

authUserSchema.plugin(deepPopulate);
//STATICS & METHODS

authUserSchema.statics.top10Users = function() {
    var usersAndAvgRatings = []

    return this.find({}).populate('college').exec()
    .then(function(users){
        return Promise.map(users, function(user){
            var userScore;
            return user.getAggregateScore()
            .then(function(score){
                userScore = score;
                usersAndAvgRatings.push(
                    {"user": user,
                    "aggregateScore": userScore
                });
            })
        })
        .then(function() {  
            return usersAndAvgRatings;
        })
    })
    .then(function(usersAndAvgRatingsArr){
        var sortedUsers = usersAndAvgRatingsArr.sort(function(a,b){
            return b.aggregateScore - a.aggregateScore;
        })
        return sortedUsers.slice(0,10)
    })
}

authUserSchema.methods.getAggregateScore = function() {

    return mongoose.model('Review').find({reviewee: this._id})
    .then(function(reviews) {
        // console.log('agg score reviews', reviews)
        if(!reviews.length) return 'User hasn\'t been reviewed yet'
        var sum = reviews.reduce(function(accum, elem) {
            return accum + elem.rating;
        }, 0)

        return sum/(reviews.length);
    })
}

authUserSchema.methods.getCart = function() {
    return mongoose.model('Cart').findOne({buyer: this._id, processed: false})
    .populate('tasks')
    .then(function(cart){
        return cart;
    })
}

authUserSchema.methods.getReviews = function() {

    return mongoose.model('Review').find({reviewee: this._id}).populate('reviewer')
    .then(function(reviews) {
        if(!reviews.length) return;
        return reviews;
    })
}

authUserSchema.methods.getCart = function() {
    return mongoose.model('Cart').findOne({buyer: this._id, processed: false})
    .deepPopulate('tasks.seller').exec()
    .then(function(cart){
        return cart;
    })
}

authUserSchema.methods.getPurchaseHistory = function() {
    return mongoose.model('Cart').find({buyer: this._id, processed: true}).deepPopulate('tasks.seller').exec();
    //deepPopulate tasks.seller is not working :(!!
}

authUserSchema.methods.getSalesHistory = function() {
    return mongoose.model('Task').find({seller: this._id, purchased: true});
}


authUserSchema.methods.getCompletedTasks = function() {
    return mongoose.model('Task').find({seller: this._id, completed: true});
}

// method to remove sensitive information from user objects before sending them out

authUserSchema.methods.sanitize =  function () {
    return _.omit(this.toJSON(), ['password', 'salt']);
};


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

authUserSchema.pre('save', function (next) {
    if (this.isModified('password')||this.isNew) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

authUserSchema.statics.generateSalt = generateSalt;
authUserSchema.statics.encryptPassword = encryptPassword;

authUserSchema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});


mongoose.model('User', authUserSchema);
