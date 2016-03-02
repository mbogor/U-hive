var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);
var Promise = require('bluebird')

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
 
require('../../../server/db/models');

var Task = mongoose.model('Task');
var User = mongoose.model('User');
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
    			expect(cart.timeCreated).to.not.be.null;
                done()
    		})
    	})

        it ('defaults processesed to false', function(done) {
            cart.validate(function() {
                expect(cart.processed).to.be.false
                done();
            })
        })

    })



    describe('methods', function() {

        var userA,
            userB,
            taskA,
            taskB, 
            cartA, 
            cartB;

        beforeEach(function(done){
            var user = new User()
            console.log('user!!!!!', user)
            Promise.all([
                Task.create({
                    seller: user._id, 
                    price: 10, 
                    description: 'This task rocks', 
                    date: 'Tuesday'
                }),
                Task.create({seller: user._id })
            ])
            .spread(function(_task1, _task2){
                  taskA = _task1;
                  taskB = _task2;
                  done()  
            })
            .then(null, done)

        })

        beforeEach(function(done){
            Promise.all([
                Cart.create({buyer: userA, tasks: [taskA], processed: true}),
                Cart.create({ buyer: userB, tasks: [taskB], processed: false})
            ])
            .spread(function(_cart1, _cart2){
                cartA = _cart1, 
                cartB = _cart2
                done()
            })
            .then(null, done)
        })


        describe('processCheckout', function() {


          it('check that cart.processed is true', function(done) {

            cartB.processCheckout(100);

            expect(cartB.process).to.be.true;
                console.log('it: ha: ');
                done();
            
          });

          // it('check that the buyer\'s uComb is updated', function(done) {

          //   // task.addChild({ name: 'task2' })
          //   // .then(function(child) {
          //   //   expect(child.parent).to.equal(task._id);
          //   //   expect(child.name).to.equal('task2');
          //   //   done();
          //   // })
          //   // .then(null, done); //catch test errors

          // });

          // it('check that the seller\'s uComb is updated', function(done) {

            
          // });

          // it('check that task.completed is true', function(done) {

            
          // });

        });
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

    // })

    //chance library
    //expect(err).to.exist
    //category
    //curl
    //more express routes
})