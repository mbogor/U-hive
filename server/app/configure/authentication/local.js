'use strict';
var passport = require('passport');
var _ = require('lodash');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Cart = mongoose.model('Cart');

module.exports = function (app) {

    // When passport.authenticate('local') is used, this function will receive
    // the email and password to run the actual authentication logic.
    var strategyFn = function (email, password, done) {
        User.findOne({ email: email })
            .then(function (user) {
                // user.correctPassword is a method from the User schema.
                if (!user || !user.correctPassword(password)) {
                    done(null, false);
                } else {
                    // Properly authenticated.
                    done(null, user);
                }
            }, function (err) {
                done(err);
            });
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

    // A POST /login route is created to handle login.
    app.post('/login', function (req, res, next) {

        var authCb = function (err, user) {

            if (err) return next(err);

            if (!user) {
                var error = new Error('Invalid login credentials.');
                error.status = 401;
                return next(error);
            }

            // req.logIn will establish our session.
            req.logIn(user, function (loginErr) {
                if (loginErr) return next(loginErr);
                // we make a cart for the user
                console.log('abt to make/update cart');
                var loginUser = user;
                Cart.findOne({guest: req.session.guest})
                .then(function(cart){
                    console.log('guest cart we found', cart);
                    if(cart){
                        cart.set('buyer', loginUser._id);
                        console.log('updated', cart);
                        return cart.save();
                    }else{
                        return Cart.create({buyer: loginUser._id});
                    }
                })
                .then(function(){
                    res.status(200).send({
                        user: loginUser.sanitize()
                    });
                })
                // We respond with a response object that has user with _id and email.
            });

        };

        passport.authenticate('local', authCb)(req, res, next);

    });

};
