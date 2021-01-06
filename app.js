const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

//this file has been git ignored for security purpose
const mongoCredential = require('./credentials/mongoCredential');
const password = mongoCredential.password;
const dbname = mongoCredential.dbname;
const username = mongoCredential.username;

const mongoConnectionString = `mongodb+srv://${username}:${password}@cluster0.qijpt.mongodb.net/${dbname}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());

//register middleware
app.use('/api/places', placesRoutes);

app.use('/api/users', usersRoutes);

//throw error to error handler if no route is found
app.use((req, res, next) => {
    const error = new HttpError('could not find this route', 404);
    return next(error);
})

//special error handling middleware
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});


//integrated mongoose function

mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(5000)
    })
    .catch(err => {
        console.log(err);
    });

