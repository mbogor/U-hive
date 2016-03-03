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
var Category = mongoose.model('Category');

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
            Promise.all([
                User.create({
                    uComb: 100, 
                    name: "Cleopatra",
                    email: "me@me.me" }),
                User.create({ 
                    uComb: 100, 
                    name: "Nefertiti", 
                    email: "queen@queen.queen"})
            ])
            .spread(function(_user1, _user2){
                userA = _user1, 
                userB = _user2
                done()
            })
            .then(null, done)
        })

        beforeEach(function(done){

            var category = new Category();
            Promise.all([
                Task.create({
                    name: "crying",
                    category: category._id,
                    forSaleOrWanted: 'wanted',
                    seller: userA._id, 
                    price: 10, 
                    description: 'This task rocks', 
                    date: Date.now()
                }),
                Task.create({
                    name: "crying while playing yoyo",
                    category: category._id,
                    forSaleOrWanted: 'forsale',
                    seller: userB._id,
                    price: 15, 
                    description: 'This task sucks', 
                    date: Date.now()
                     })
            ])
            .spread(function(_task1, _task2){
                  taskA = _task1;
                  taskB = _task2;
                  console.log("TASK B",taskB)
                  done()  
            })
            .then(null, done)

        })

        beforeEach(function(done){

            Promise.all([
                Cart.create({buyer: userB._id, tasks: [taskA], processed: true}),
                Cart.create({ buyer: userA._id, tasks: [taskB], processed: false})
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
            
            console.log("CART B ",cartB)
            console.log("TASK B HERE", taskB)
            console.log("task b id ", taskB._id)

            
            cartB.processCheckout(100)
            .then(function(){
                expect(cartB.processed).to.be.true; 
            })




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