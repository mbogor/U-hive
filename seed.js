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
var _ = require('lodash');
var connectToDb = require('./server/db');

var User = Promise.promisifyAll(mongoose.model('User'));
var Task = Promise.promisifyAll(mongoose.model('Task'));

var modelsHash = {
    "User": User,
    "Task": Task
}

var seed = {

    User: [
        { name: 'Obama', email: 'obama@gmail.com', uComb: 9000, password: 'potus'},
        { name: 'Clinton', email: 'clinton@gmail.com', uComb: 2000, password: 'bill'},
        { name: 'Rubio', email: 'rubio@gmail.com', uComb: 500, password: 'secondchoice'},
        { name: 'O\'Mally', email: 'omally@gmail.com', uComb: 20, password: 'who'},
        { name: 'Sanders', email: 'sanders@gmail.com', uComb: 400, password: 'democrat'},
        { name: 'Trump', email: 'trump@gmail.com', uComb: -40, password: 'moneyrules'},
        { name: 'BusyBee', email: 'busybee@gmail.com', uComb: 1000000, isAdmin: true, password: 'buzz'}
    ],
    Task: [
        {   name:'clean your room', 
            price:30, 
            date: moment().add(7, 'days').calendar(), 
            description:"second best task ever", 
            forSaleOrWanted:"forsale", 
            completed:true
        },
        {   name:'bring cookies', 
            price:10, 
            date: moment().add(3, 'days').calendar(), 
            description:"please make me 1 dozen nice cookies", 
            forSaleOrWanted:"wanted", 
            completed:false
        },
        {   name:'ride home', 
            price:30, 
            date: moment().add(14, 'days').calendar(), 
            description:"pick me up from JFK, take me to Williamsburg", 
            forSaleOrWanted:"wanted", 
            completed:false
        },
        {   name:'grocery shopping', 
            price:15, 
            date: moment().add(0.5, 'days').calendar(), 
            description:"I need eggs and milk", 
            forSaleOrWanted:"wanted", 
            completed:false
        },
        {   name:'Computer help', 
            price:30, 
            date: moment().add(7, 'days').calendar(), 
            description:"I can fix your computer", 
            forSaleOrWanted:"forsale", 
            completed:false
        },
        {   name:'Computer help', 
            price:30, 
            date: moment().subtract(7, 'days').calendar(), 
            description:"I can fix your computer", 
            forSaleOrWanted:"forsale", 
            completed:true
        },
    ]

    // Category: [{}],

};

connectToDb.then(function() {
    mongoose.connection.db.dropDatabase(function() {
        console.log('Dropped old data, now inserting new data');
        Promise.map(Object.keys(seed), function(modelName) {

            return Promise.map(seed[modelName], function(item) {

                return modelsHash[modelName].create(item)
                .then(null, console.log);
            });
        }).then(function() {
            console.log("Finished inserting data");
            }, console.log).then(function() {
            mongoose.connection.close()
       });
    })
});


            // if(modelName==='Task'){
            //     // console.log('seed tasks', seed.Task[0].date);
            //     getAllUsers()
            //     .then(function(uIds){
            //         console.log('arr of uids', uIds)
            //         assignTasks(uIds)
            //     })
            // }
function getAllUsers(){
    var userIds = [];
    return mongoose.model('User').find({})
    .then(function(users){
        users.forEach(function(user){
            userIds.push(user._id);
        })
        return userIds;
    })


}

function assignTasks(uId){
    seed.Task.forEach(function(task){
        task.seller = _.sample(uId);
    });
    console.log(seed.Task[1]);
}

// mongoose.connection.on('open', function() {
//  mongoose.connection.db.dropDatabase(function() {

//    console.log("Dropped old data, now inserting data");

//  });
// });

// connectToDb.then(function () {
//     User.findAsync({}).then(function (users) {
//         if (users.length === 0) {
//             return seedUsers();
//         } else {
//             console.log(chalk.magenta('Seems to already be user data, exiting!'));
//             process.kill(0);
//         }
//     }).then(function () {
//         console.log(chalk.green('Seed successful!'));
//         process.kill(0);
//     }).catch(function (err) {
//         console.error(err);
//         process.kill(1);
//     });
// });

// var collegeNames = [{name: 'NYU', location: {_nycId}, streetAddress: 132 some St, zipCode: 10101},'CUNY Hunter', 'Columbia','Fordham', 'Manhattan CC', 'Brooklyn College','Grace Hopper Academy']
