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

var mongoose = require('mongoose');
var Promise = require('bluebird');
var moment = require('moment');
var chalk = require('chalk');
var chance = require('chance');
var _ = require('lodash');
var db;

var connectToDb = require('./server/db');

var categories = ['food', 'tutoring', 'delivery', 'moving', 'cleaning', 'other'];

var colleges = [{name: 'NYU', location: 'New York City, NY', streetAddress: '123 N West St', zipCode:12345},
    {name: 'Columbia', location: 'New York City, NY', streetAddress: '456 N North St', zipCode:12345},
    {name: 'Hunter', location: 'New York City, NY', streetAddress: '789 N West St', zipCode:12345}];

var userArr = [];

var taskArr = [];

function randPhoto(){
    var g = chance.pick(['men', 'women']);
    var n = _.random(0,96)
    return 'http://api.randomuser.me/portraits/thumb/' + g + '/' + n + '.jpg';
};

function makeColleges(){
    var collegeArr = [];
    collegeArr.forEach(function(col){
        collegeArr.push(new College(col));
    });
    return collegeArr;
};

function makeUsers(){
    return new User({
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
        name: chance.sentence({words: _.random(3,15)}),
        category: categories[_.random(0,categories.length-1)],
        price: _.random(10,100),
        description: chance.sentence({words: _.random(15,40)}),
        imageUrl: 'http://lorempixel.com/400/200/',
        date: chance.date({year: 2016}),
        restrictedByCampus: chance.weighted([true, false], [50,50]),
        completed: false,
        purchased: chance.weighted([true, false], [50,50]),
        forSaleOrWanted: chance.weighted(['forsale', 'wanted'], [50,50]),
    });
};
function addSellerToTasks(){

};

function addCollegeToUsers(){

};

function generateAll () {
    var users = _.times(15, makeUsers);
    users.push(new User({
        name: 'Busy Bees',
        email: 'bb@gmail.com',
        password: 'buzz',
        uComb: _.random(10,500),
        photo: randPhoto(),
        isAdmin: false,
        phone: chance.phone()
    }));
    var tasks = _.times(40, makeTasks);
}

connectToDb.then(function() {
    mongoose.connection.db.dropDatabase(function() {
        console.log('Dropped old data, now inserting new data');

        return seed();


    })
    .then(function(){
        console.log('Done inserting data!');
        mongoose.connection.close()
    })
});
