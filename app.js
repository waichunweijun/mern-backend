const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');


const app = express();

//register middleware
app.use('/api/places', placesRoutes);

app.listen(5000);