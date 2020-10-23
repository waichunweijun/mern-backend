const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

//register middleware
app.use('/api/places', placesRoutes);

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
})

app.listen(5000);