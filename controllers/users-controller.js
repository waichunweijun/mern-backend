const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');


const getUserByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    // const user = DUMMY_USERS.find(u => u.id === userId);
    let user;
    try {
        user = await User.findById(userId).exec();
    }
    catch (err) {
        error = new HttpError(`could not find user with id: ${userId}`, 404);
        return next(error);
    }
    if (!user) {
        const error = new HttpError(`Could not find user with id : ${userId}`, 404);
        return next(error);
    }
    res.json({ user: user.toObject({ getters: true }) });

}

const getUsers = async (req, res, next) => {

    let users;

    try {
        //find all, exclude password
        users = await User.find({}, '-password').exec();
    }
    catch (err) {
        const error = new HttpError('Something went wrong when getting users', 500);
        return next(error);
    }


    res.json({ users: users.map(user => user.toObject({ getters: true })) })

}

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    //if there is an error 
    //cant use if (errors) apparently
    if (!errors.isEmpty()) {
        const error = new HttpError("Invalid input supplied.", 422);
        return next(error);
    }
    const { name, email, password } = req.body;
    let existingUser;

    // check if user exist already
    try {
        existingUser = await User.findOne({ email: email }).exec();
    }
    catch (err) {
        error = new HttpError('Something wrong when finding user by email');
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User with this email already created in the system. Please login instead');
        return next(error);
    }

    const newUser = new User({
        name, email, password,
        image: 'https://picsum.photos/200/300',
        //places
    });

    try {
        await newUser.save();
    }
    catch (err) {
        error = new HttpError('Sign up failed', 500);
        return next(error);
    }

    res.status(201).json({ user: newUser.toObject({ getters: true }) });

}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let foundUser;
    try {
        foundUser = await User.findOne({ email, password }).exec();
    }
    catch (err) {
        error = new HttpError('something went wrong during login.', 500);
        return next(error);
    }

    if (!foundUser) {
        error = new HttpError('login failed, credential does not match', 401);
        return next(error);
    }
    res.json({ message: 'logged in!' });
}

exports.getUserByUserId = getUserByUserId;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;