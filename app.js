const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({ maxAge : 2592000000 , keys: [require('./config/keyController').cookieKey]}))

require('./database/connection');
require('./database/models/userSchema');

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./authentication/passport'))

require('./routeConfig')(app);

module.exports = app;
