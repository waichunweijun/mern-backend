const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

const Place = require('../models/place');

let DUMMY_PLACES = [
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
    },
    {
        id: 'p2',
        title: 'MBS 2',
        description: 'Singapore MBS2 ',
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
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });
    //send back response immediately
    if (!place) {
        throw new HttpError(`Could not find place with place id: ${placeId}`, 404);
    };
    res.json({ place });
}


const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    });
    //send back response immediately
    if (!places || places.length === 0) {
        return next(
            new HttpError(`Could not find place with user id: ${userId}`, 404)
        );
    };
    res.json({ places });
}


const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    //if there is an error 
    //cant use if (errors) apparently
    if (!errors.isEmpty()) {
        const error = new HttpError("Invalid input supplied.", 422);
        return next(error);
    }
    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    }
    catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title, description, address, location: coordinates, image: 'https://picsum.photos/200/300', creator
    })

    //mongoose save method
    try {
        await createdPlace.save();
    }
    catch (err) {
        const error = new HttpError(
            'creating place failed, please try again',
            500
        );
        return next(error);
    }

    //send back response
    res.status(201).json({ place: createdPlace });

}

const updatePlace = (req, res, next) => {
    const placeId = req.params.pid;

    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        const error = new HttpError(`place cannot be found with id: ${placeId}`, 404);
        return next(error);
    }

    //check for error in places-routes express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError("Invalid input supplied.", 422);
        return next(error);
    }

    const { title, description } = req.body;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;
    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({ place: updatedPlace });

}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;

    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        const error = new HttpError(`place cannot be found with id: ${placeId}`, 404);
        return next(error);
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => {
        p.id !== placeId
    })
    res.status(200).json({ message: `place with id: ${placeId} deleted` });
}



exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;