var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
 
require('../../../server/db/models');

var Cart = mongoose.model('Cart');

describe('Cart model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Cart).to.be.a('function');
    });

    describe('Validations', function() {
        var cart;
    	beforeEach(function() {
    		cart = new Cart();
    	})

    	it ('defaults to the current date', function(done) {
    		cart.validate(function() {
    			expect(cart.timeCreated).to.equal(Date())
    			done();
    		})
    	})

        it ('defaults processesed to false', function(done) {
            cart.validate(function() {
                expect(cart.processed).to.be.false
                done();
            })
        })

        // Will do this later, not sure how to validate 'enum' field

    	// it ('defaults to the correct rating array', function(done) {
    	// 	review.validate(function() {
    	// 		expect(review.rating).to.equal(ratings)
    	// 		done();
    	// 	})
    	// })


    	// it ('errors without a reviewBy', function(done) {
    	// 	review.validate(function() {
    	// 		expect(review.reviewBy).to.be.undefined
    	// 		done();
    	// 	})
    	// })

    })

	// describe('Success', function() {
 //        var gardeningReview;
	// 	beforeEach(function(done) {
 //    		 Review.create({text: "reviewwww"})
 //    			.then(function(review) {
 //                    gardeningReview = review;
 //                    done()
 //                }, done)
    			
 //    	})

 //    	it ('successfully creates a review', function(done) {

 //    		Review.findById(gardeningReview._id)
 //    		.then(function(review){
 //    			expect(review.text).to.equal(gardeningReview.text)
 //                done();
 //    		})
 //            .then(null, done)

 //    	})

 //    })
})