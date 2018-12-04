'use strict';

var GoogleOAuthStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');

module.exports = function(passport, config) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleOAuthStrategy({
        clientID: config.keychain.googleoid,
        clientSecret: config.keychain.googleoidsecret,
        callbackURL: config.googleAuthCallback
    }, function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({'google.id': profile.id}, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.group = null;
                    newUser.admin = false;

                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }
            });
        });
    }));
}
