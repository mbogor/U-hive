'use strict';
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var _ = require('lodash');
var passport = require('passport');
var path = require('path');
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var baseUserM =  mongoose.model('baseUser');

var ENABLED_AUTH_STRATEGIES = [
    'local',
    //'twitter',
    //'facebook',
    //'google'
];

module.exports = function (app) {

    // First, our session middleware will set/read sessions from the request.
    // Our sessions will get stored in Mongo using the same connection from
    // mongoose. Check out the sessions collection in your MongoCLI.
    app.use(session({

        secret: app.getValue('env').SESSION_SECRET,
        store: new MongoStore({mongooseConnection: mongoose.connection}),
        resave: false,
        saveUninitialized: false
    }));

    
    app.use(function(req,res,next){ 
        console.log(req.body, req.session.user, req.session.id);
        console.log("we are running this bullshit")
        next()
    })

    // Initialize passport and also allow it to read
    // the request session information.
    app.use(passport.initialize());
    app.use(passport.session());

    // When we give a cookie to the browser, it is just the userId (encrypted with our secret). //this runs once ever(ish)
    passport.serializeUser(function (user, done) {
        console.log('passport user', user)
        done(null, user.id);
    });


    // When we receive a cookie from the browser, we use that id to set our req.user
    // to a user found in the database.
    passport.deserializeUser(function (id, done) {
        console.log("deserialize ID", id)
        UserModel.findById(id, done);
        // baseUserM.findById()
    });


    app.use(function(req, res, next){
  
        console.log('req session!!!!!!!!!', req.session)
        if(!req.data){
            baseUserM.findById()
        }
        next()
    });
    // We provide a simple GET /session in order to get session information directly.
    // This is used by the browser application (Angular) to determine if a user is
    // logged in already.
    
    // app.get('/unauthU', function(req, res, next){
    //     console.log("req.user", req.user)
    //     console.log("req session id", req.session.id)
    //     console.log("req.id, req._id", req.id, req._id)
        
    //     // if(req.session) return;

    //     // baseUserM.findById(req._id)
    // })



    app.get('/session', function (req, res, next) {
        console.log("pre creation auth id", req.session.id);
        console.log("res.session auth", res.session)
        console.log("req.user", req.user)
        if (req.user) {
            var data = { user: req.user.sanitize(), id: req.session.id };
            console.log('sending user for auth user', data)
            res.send(data);
        } else {
            console.log('about to send 401');
            baseUserM.create({})
            .then(function(user){
                console.log("recently created user", user)
                console.log("post creation req", req.session.user);
                console.log("post creation res", res.session)
                var data = { user: user, id: req.session.id };
                res.status(201).send(data)

            })
            .then(null,next)

            // res.status(401).send('No authenticated user.');
        }
    })




    // Simple /logout route.
    app.get('/logout', function (req, res) {
        req.logout();
        res.status(200).end();
    });

    // THIS IS WHERE THE /LOGIN POST ROUTE LANDS
    // Each strategy enabled gets registered.
    ENABLED_AUTH_STRATEGIES.forEach(function (strategyName) {
        require(path.join(__dirname, strategyName))(app);
    });

};
