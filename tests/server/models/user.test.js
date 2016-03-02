var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird')


// Require in all models.
// FOR CODE REVIEW: Review why this needs to be here and not at line 9 as originally
var models = require('../../../server/db/models');
var User = mongoose.model('User');
var Task  = mongoose.model('Task');
var Category = mongoose.model('Category');

describe('User model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db)  return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(User).to.be.a('function');
    });

    describe('password encryption', function () {

        describe('generateSalt method', function () {

            it('should exist', function () {
                expect(User.generateSalt).to.be.a('function');
            });

            it('should return a random string basically', function () {
                expect(User.generateSalt()).to.be.a('string');
            });

        });

        describe('encryptPassword', function () {

            var cryptoStub;
            var hashUpdateSpy;
            var hashDigestStub;
            beforeEach(function () {

                cryptoStub = sinon.stub(require('crypto'), 'createHash');

                hashUpdateSpy = sinon.spy();
                hashDigestStub = sinon.stub();

                cryptoStub.returns({
                    update: hashUpdateSpy,
                    digest: hashDigestStub
                });

            });

            afterEach(function () {
                cryptoStub.restore();
            });

            it('should exist', function () {
                expect(User.encryptPassword).to.be.a('function');
            });

            it('should call crypto.createHash with "sha1"', function () {
                User.encryptPassword('asldkjf', 'asd08uf2j');
                expect(cryptoStub.calledWith('sha1')).to.be.ok;
            });

            it('should call hash.update with the first and second argument', function () {

                var pass = 'testing';
                var salt = '1093jf10j23ej===12j';

                User.encryptPassword(pass, salt);

                expect(hashUpdateSpy.getCall(0).args[0]).to.be.equal(pass);
                expect(hashUpdateSpy.getCall(1).args[0]).to.be.equal(salt);

            });

            it('should call hash.digest with hex and return the result', function () {

                var x = {};
                hashDigestStub.returns(x);

                var e = User.encryptPassword('sdlkfj', 'asldkjflksf');

                expect(hashDigestStub.calledWith('hex')).to.be.ok;
                expect(e).to.be.equal(x);

            });

        });

        describe('on creation', function () {

            var encryptSpy;
            var saltSpy;

            var createUser = function () {
                return User.create({ name: 'Obama', email: 'obama@gmail.com', password: 'potus' });
            };

            beforeEach(function () {
                encryptSpy = sinon.spy(User, 'encryptPassword');
                saltSpy = sinon.spy(User, 'generateSalt');
            });

            afterEach(function () {
                encryptSpy.restore();
                saltSpy.restore();
            });

            it('should call User.encryptPassword with the given password and generated salt', function (done) {
                createUser().then(function () {
                    var generatedSalt = saltSpy.getCall(0).returnValue;
                    expect(encryptSpy.calledWith('potus', generatedSalt)).to.be.ok;
                    done();
                });
            });

            it('should set user.salt to the generated salt', function (done) {
               createUser().then(function (user) {
                   var generatedSalt = saltSpy.getCall(0).returnValue;
                   expect(user.salt).to.be.equal(generatedSalt);
                   done();
               });
            });

            it('should set user.password to the encrypted password', function (done) {
                createUser().then(function (user) {
                    var createdPassword = encryptSpy.getCall(0).returnValue;
                    expect(user.password).to.be.equal(createdPassword);
                    done();
                });
            });

        });

        describe('sanitize method', function () {

            var createUser = function () {
                return User.create({ name: 'Obama', email: 'obama@gmail.com', password: 'potus' });
            };

            it('should remove sensitive information from a user object', function () {
                createUser().then(function (user) {
                    var sanitizedUser = user.sanitize();
                    expect(user.password).to.be.ok;
                    expect(user.salt).to.be.ok;
                    expect(sanitizedUser.password).to.be.undefined;
                    expect(sanitizedUser.salt).to.be.undefined;
                });
            });
        });




    });

    describe('methods & statics', function(){
        var user1 = { name: 'Obama', email: 'obama@gmail.com'};
        var task1 = {
                    name:'save the country', 
                    price:30, 
                    date: new Date(), 
                    description:"best task ever", 
                    forSaleOrWanted:"forsale", 
                    completed:false
                };
        var task2 = {
            name:'another', 
            price:3000, 
            date:new Date() -1000*60*60*24*7, 
            description:"second best task ever", 
            forSaleOrWanted:"forsale", 
            completed:true
        };
        var sellerG;

        beforeEach(function(done){
            User.create(user1)
            .then(function(seller){
                var sellerId = seller._id;
                task1.seller = sellerId;
                task2.seller = sellerId;
                sellerG = seller;
                done()
            })
            .then(null, done);
        });

        beforeEach(function(done){
            Category.create({name:"Cat1"})
            .then(function(category){
                task1.category = category._id;
                task2.category = category._id;
                done()
            })
            .then(null, done);
        })

        beforeEach(function(done){
            Promise.all([Task.create(task1),Task.create(task2)])
            .spread(function(t1, t2){
                console.log('t1', t1, 't2', t2)
                done();
            })
            .then(null, done)

        });

        afterEach(function(done){
            return Promise.all([Task.remove(), User.remove()])
            .then(function(){
                done()
            })
            .then(null, done);
        });

        describe('completed tasks method', function(){

            it('should return a list of all seller\'s completed tasks', function(done){
                sellerG.getCompletedTasks()
                .then(function(tasks){
                    expect(tasks).to.have.length(1);
                    tasks.forEach(function(task){
                        expect(task.completed).to.be.true;
                    });
                    done()
                })
                .then(null, done)
            })

        })

    });
});

