const express = require('express');
const authRoute = express.Router();

const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const authStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('../database/connection');
const userModel = mongoose.model('user');

passport.serializeUser((user,done) => done(null,user.id));

passport.deserializeUser((id,done) => userModel.findById(id).then((user) => done(null,user)))

let Strategy = new authStrategy(
    {
        clientID : require('../config/keyController').clientID,
        clientSecret : require('../config/keyController').clientSecret,
        callbackURL: '/auth/google/callback',
        accessType: 'offline',
        prompt: 'consent'
    },
    (accessToken, refreshToken, profile, done) => {
        userModel.findOne({ authid: profile.id })
            .then((existingUser) => {
                if(existingUser) {
                    done(null, existingUser)
                }
                new userModel({ authid: profile.id }).save()
                .then((objNewUser) => {
                    done(null,objNewUser);
                })
            })
    },
)

passport.use(Strategy);
refresh.use(Strategy);


authRoute.get('/auth/google/',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
);

authRoute.get('/auth/google/callback/', passport.authenticate('google'),(req,res) =>  {
    res.send("Authentication successfull")
});

authRoute.get('/auth/logout', (req,res) => {
    req.logOut();
    res.send("Logout Succesfull");
})
module.exports = authRoute;
