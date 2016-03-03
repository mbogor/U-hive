var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.

require('../../../server/db/models');

var Task = mongoose.model('Task');

describe('Task model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Task).to.be.a('function');
    });

    describe('Validations', function() {
    	var task;
    	beforeEach(function() {
    		task = new Task();
    	})

    	it ('errors without a name', function(done) {
    		task.validate(function() {
    			expect(task.name).to.be.undefined
    			done();
    		})
    	})

    	it ('errors without a category', function(done) {
    		task.validate(function() {
    			expect(task.category).to.be.empty
    			done();
    		})
    	})

    	it ('errors without a price', function(done) {
    		task.validate(function() {
    			expect(task.price).to.equal(0)
    			done();
    		})
    	})

    	it ('errors without a description', function(done) {
    		task.validate(function() {
    			expect(task.description).to.be.undefined
    			done();
    		})
    	})

    	it ('errors without a date', function(done) {
    		task.validate(function() {
    			expect(task.date).to.be.undefined
    			done();
    		})
    	})

    	it ('errors without a forSaleOrWanted', function(done) {
    		task.validate(function() {
    			expect(task.forSaleOrWanted).to.be.undefined
    			done();
    		})
    	})
    })

	describe('Success', function() {
        var gardeningTask;
		beforeEach(function(done) {
    		 Task.create({name: 'garden',
                category: ['cleaning', 'other'],
                price: 200,
                description: 'plant a tree',
                dateOffered: new Date(2040, 11, 17, 3, 24, 0),
                forSaleOrWanted: 'forsale'})
    			.then(function(task) {
                    gardeningTask = task;
                    done()
                }, done)

    	});
        beforeEach(function(done){
            Promise.all([
                Task.create({name: 'pack for u',
                    category: ['moving'],
                    price: 200,
                    description: 'plant a tree',
                    dateOffered: new Date(2040, 11, 17, 3, 24, 0),
                    datePosted: new Date(2016, 1, 2),
                    forSaleOrWanted: 'forsale'}),
                Task.create({name: 'garden',
                    category: ['tutoring', 'other'],
                    price: 200,
                    description: 'plant a tree',
                    dateOffered: new Date(2040, 11, 17, 3, 24, 0),
                    forSaleOrWanted: 'forsale'})
                ])
            .then(function(){
                done()
            })
        })

    	it ('successfully creates a task', function(done) {

    		Task.findById(gardeningTask._id)
    		.then(function(task){
    			expect(task.name).to.equal(gardeningTask.name)
                done();
    		})
            .then(null, done)


        // Task.findById(gardeningTask._id, function(err, task){
        //     if (err) {
        //         console.log('err: ', err)
        //         done(err)
        //     }
        //     else {
        //         expect(task.name).to.equal(gardeningTask.name)
        //         done();
        //     }

        // })
            // .then(function(task){
            //     console.log('task', task)
            //     done();
            // })
            // .then(null, done)
    	})
        describe('methods and statics', function(){
            describe('newPosts', function(){
                it('should get all posts 1 week old or less',function(){
                    Task.newPosts()
                    .then(function(tasks){
                        expect(tasks.length).to.equal(2);
                    })
                });
            })
            describe('findSimilar', function(){
                it('should get any tasks with a matching category', function(){
                    gardeningTask.findSimilar()
                    .then(function(tasks){
                        expect(tasks.length).to.equal(1);
                    })
                })
            })
        })
    });

})
