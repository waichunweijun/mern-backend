const express = require('express');
const HttpError = require('../models/http-error');
const router = express.Router();

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'MBS',
        description: 'Singapore MBS',
        location: {
            lat: 1.2838989,
            lon: 103.8585418
        },
        address: '10 Bayfront Ave, Singapore 018956',
        creator: 'u1'
    }
]

//get place by id
router.get('/:pid', (req, res, next) => {

    const placeId = req.params.pid;
    console.log(`pid: ${placeId}`);
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });
    //send back response immediately
    if (!place) {
        throw new HttpError(`Could not find place with place id: ${placeId}`, 404);
    };
    res.json({ place });
});

//get place by user id
router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    console.log(`pid: ${userId}`);
    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId;
    });
    //send back response immediately
    if (!place) {
        return next(
            new HttpError(`Could not find place with user id: ${userId}`, 404)
        );
    };
    res.json({ place });
});


module.exports = router;