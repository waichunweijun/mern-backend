const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');

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

const getPlaceById = (req, res, next) => {

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
}


const getPlaceByUserId = (req, res, next) => {
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
}


const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        id: uuid(), title, description, location: coordinates, address, creator
    }
    DUMMY_PLACES.push(createPlace);
    //send back response
    res.status(201).json({ place: createdPlace });

}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
