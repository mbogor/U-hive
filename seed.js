/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

//reminder to delete the location and category models

var mongoose = require('mongoose');
var Promise = require('bluebird');
var moment = require('moment');
var chalk = require('chalk');
var chance = require('chance')(12345);
var _ = require('lodash');
var models = require('./server/db/models')
var User = mongoose.model('User');
var Task = mongoose.model('Task');
var Review = mongoose.model('Review');
var Cart = mongoose.model('Cart');
var College = mongoose.model('College');

var connectToDb = require('./server/db');

var categoriesArr = ['food', 'tutoring', 'delivery', 'moving', 'cleaning', 'other'];

var collegesArr = [
    {name: 'NYU', location: 'New York City, NY', streetAddress: '123 N West St', zipCode:12345},
    {name: 'Columbia', location: 'New York City, NY', streetAddress: '456 N North St', zipCode:12345},
    {name: 'Hunter', location: 'New York City, NY', streetAddress: '789 N West St', zipCode:12345} ];

function randPhoto(){
    var g = chance.pick(['men', 'women']);
    var n = _.random(0,96)
    return 'http://api.randomuser.me/portraits/thumb/' + g + '/' + n + '.jpg';
};

function makeColleges(){
    return collegesArr.map(function(college){
        return new College(college)
    })
};

function makeUsers(){
    return new User({
        //college: reference to College
        name: [chance.first(), chance.last()].join(' '),
        email: chance.email(),
        password: chance.word(),
        uComb: _.random(10,500),
        photo: randPhoto(),
        isAdmin: chance.weighted([true, false], [5,95]),
        phone: chance.phone()
    });
};

function makeTasks(){
    return new Task({
        //seller: reference to User
        name: chance.sentence({words: _.random(3,15)}),
        category: categoriesArr[_.random(0,categoriesArr.length-1)],
        price: _.random(10,100),
        description: chance.sentence({words: _.random(15,40)}),
        imageUrl: 'http://lorempixel.com/400/200/',
        dateOffered: chance.date({year: 2016}),
        restrictedByCampus: chance.weighted([true, false], [50,50]),
        completed: false,
        purchased: chance.weighted([true, false], [50,50]),
        forSaleOrWanted: chance.weighted(['forsale', 'wanted'], [50,50]),
    });
};

function makeReviews() {
    return new Review ({
    //reviewee: reference to User
    //reviewer: reference to User
    //task: reference to Task
    text: chance.sentence({words: _.random(15, 40)}),
    rating: _.random(1,5),
    reviewBy: chance.weighted(['Buyer', 'Seller'], [50,50])
    })
};

function makeCarts() {
    return new Cart ({
    //buyer: reference to User
    //tasks: [reference to Task]
    timeCreated: chance.date({month: _.random(0,3), year: 2016}),
    processed: chance.weighted([true, false], [10,90])
    })
}

function addCollegeToUser(user){
    return College.find({})
    .then(function(colleges){
        var randCollege = _.sample(colleges);
        user.college = randCollege._id;
        return user.save();
    })
};

function addSellerToTask(task){
    return User.find({})
    .then(function(users){
        var randUser = _.sample(users);
        task.seller = randUser._id;
        return task.save();
    })
};

function addRevieweeReviewerAndTaskToReview(review){
    return Promise.all([
        User.find({}),
        Task.find({})
        ])
        .spread(function(users, tasks){
            var randPeople = _.sample(users, 2);
            var randReviewee = randPeople[0];
            var randReviewer = randPeople[1];
            var randTask = _.sample(tasks);

            review.reviewee = randReviewee._id;
            review.reviewer = randReviewer._id;
            review.task = randTask._id;
            return review.save();
        })
};

function addBuyerAndTasksToCart(cart) {
    return Promise.all([
        User.find({}),
        Task.find({}) ///we don't want a task where the task's seller is the cart's buyer
        ])
        .spread(function(users, tasks) {
            var randUser = _.sample(users);
            var randTasks = _.sample(tasks, _.random(1,4));

            cart.buyer = randUser._id;
            cart.tasks = randTasks.map(function(task){
                return task._id
            })
            return cart.save();
        })
};

function generateAll () {
    var colleges = makeColleges();
    var users = _.times(15, makeUsers);
    users.push(new User({
        name: 'Busy Bees',
        email: 'bb@gmail.com',
        password: 'buzz',
        uComb: _.random(10,500),
        photo: randPhoto(),
        isAdmin: true,
        phone: chance.phone()
    }));
    var tasks = _.times(40, makeTasks);
    var reviews = _.times(40, makeReviews);
    var carts = _.times(5, makeCarts);
    // console.log(colleges)
    return users.concat(tasks).concat(reviews).concat(carts).concat(colleges)
}

function seed() {
    var docs = generateAll();
    return Promise.map(docs, function(doc){
        // console.log(doc)
        return doc.save()
    })
    .then(function(savedDocs){
        // console.log(savedDocs)
        return Promise.map(savedDocs, function(doc){
            // console.log(doc)
            if(doc instanceof User) return addCollegeToUser(doc);
            else if (doc instanceof Task) return addSellerToTask(doc);
            else if (doc instanceof Review) return addRevieweeReviewerAndTaskToReview(doc);
            else if (doc instanceof Cart) return addBuyerAndTasksToCart(doc);
            else if (doc instanceof College) return doc.save();
        })
    })
}

connectToDb.then(function () {
   User.find({}).then(function (users) {
       if (users.length === 0) {
           return seed();
       } else {
           console.log(chalk.magenta('Seems to already be user data, exiting!'));
           process.kill(0);
       }
   }).then(function () {
       console.log(chalk.green('Seed successful!'));
       process.kill(0);
   }).catch(function (err) {
       console.error(err);
       process.kill(1);
   });
});
