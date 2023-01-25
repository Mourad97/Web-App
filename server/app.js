require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const createError = require('http-errors'); 
require ('./socket-handler');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', require('./routes/auth'));

app.use((err, req, res, next) => {
    if(err.name === 'MongoError' || err.name === 'ValidationError' || err.name === 'CastError'){
        err.status = 422;
    }
    if(req.get('accept').includes('json')){
        res.status(err.status || 500).json({message: err.message || 'some error eccured.'});
    } else {
        res.status(err.status || 500).sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

app.use((err, req, res, next) => {
    if(err.name === 'MongoError' || err.name === 'ValidationError' || err.name === 'CastError'){
        err.status = 422;
    }
    res.status(err.status || 500).json({message: err.message || 'some error eccured.'});
});


mongoose.connect(process.env.DB_URL, {useNewUrlParser: true}, err => {
    if(err) console.log( err);
    console.log('Connected successfully');
});

module.exports = app;
