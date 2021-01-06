const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const getPlaceById = async (req, res, next) => {

    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId).exec();
    }
    catch (err) {
        const error = new HttpError(
            'something went wrong, could not find place',
            500
        );
        return next(error);
    }

    //send back response immediately
    if (!place) {
        const error = new HttpError(`Could not find place with place id: ${placeId}`, 404);
        return next(error);
    };
    // convert mongoose obj to normal JS obj
    res.json({ place: place.toObject({ getters: true }) });
    // res.json({ place });
}


const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    //let places;

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
    }
    catch (err) {
        error = new HttpError('something went wrong when searching for places by user id', 500)
        return next(error);
    }


    //send back response immediately
    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        return next(
            new HttpError(`Could not find place with user id: ${userId}`, 404)
        );
    };
    res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
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

    let user;

    try {
        user = await User.findById(creator);
    }
    catch (err) {
        const error = new HttpError(
            'creating place failed, please try again',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            `could not find user with id: ${creator}`,
            404
        );
        return next(error);
    }

    console.log(user);

    //mongoose save method
    try {

        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    }
    catch (err) {
        const error = new HttpError(
            'creating place failed, please try again',
            500
        );
        return next(error);
    }

    //send back response
    res.status(201).json({ place: createdPlace.toObject({ getters: true }) });

}

const updatePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    //check for error in places-routes express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError("Invalid input supplied.", 422);
        return next(error);
    }

    const { title, description } = req.body;

    let updatedPlace;

    try {
        updatedPlace = await Place.findById(placeId).exec();
    }
    catch (err) {
        error = new HttpError("something wrong when finding place", 500);
        return next(error);
    }

    updatedPlace.title = title;
    updatedPlace.description = description;
    try {
        await updatedPlace.save();
    }
    catch (err) {
        error = new HttpError("something wrong when saving place", 500);
        return next(error);
    }

    res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });

}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;

    try {
        //we can also use place.remove once we find place by id.
        //place = await Place.findByIdAndDelete(placeId).exec();
        //populate only works if schema is defined with ref
        place = await Place.findById(placeId).populate('creator').exec();
    }
    catch (err) {
        error = new HttpError('something when wrong when finding place', 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError("couldn't find place with this id", 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    }
    catch (err) {
        error = new HttpError('something when wrong when removing place', 500);
        return next(error);
    }

    res.status(200).json({ message: `place with id: ${placeId} deleted` });
}



exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;