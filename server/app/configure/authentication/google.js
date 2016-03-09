'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function (app) {

    var googleConfig = app.getValue('env').GOOGLE;

    var googleCredentials = {
        clientID: '1043987121834-k55j4pa204mfrg72pfldin88snpc0iqc.apps.googleusercontent.com',
        clientSecret: 'z86x7lXZX9OKkCtWaRpPYn8A',
        callbackURL: '/auth/google/callback'
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {

        UserModel.findOne({ 'google.id': profile.id }).exec()
            .then(function (user) {
                if (user) {
                    return user;
                } else {
                    
                    // var newUser = new UserModel();

                    // newUser.name = 'Chica';
                    // newUser.email = 'gmail.com';
                    // newUser.google.id = profile.id;

                    // console.log(newUser);
                    // return newUser.save();

                    // return newUser.save();

                    return UserModel.create({
                        google: {
                            id: profile.id
                        }
                    });
                }

            }).then(function (userToLogin) {
                console.log(userToLogin)
                done(null, userToLogin);
            }, function (err) {
                console.error('Error creating user from Google authentication', err);
                done(err);
            });

    };

    passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

    app.get('/auth/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

};



