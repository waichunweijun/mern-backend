const uuid = require('uuid/v4');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

let DUMMY_USERS = [{
    id: 'u1',
    name: 'waichun',
    email: 'test@test.com',
    password: 'test',
}
]
const getUserByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const user = DUMMY_USERS.find(u => u.id === userId);

    if (!user) {
        const error = new HttpError(`Could not find user with id : ${userId}`, 404);
        return next(error);
    }

    res.json({ user });

}

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS })
}

const signup = (req, res, next) => {
    const errors = validationResult(req);
    //if there is an error 
    //cant use if (errors) apparently
    if (!errors.isEmpty()) {
        const error = new HttpError("Invalid input supplied.", 422);
        return next(error);
    }
    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => {
        return u.email === email
    });

    if (hasUser) {
        const error = new HttpError('Email already exist', 422);
        return next(error);
    }

    const newUser = {
        id: uuid(),
        name,
        email,
        password
    }



    DUMMY_USERS.push(newUser);

    res.status(201).json({ user: newUser });


}

const login = (req, res, next) => {
    const { email, password } = req.body;
    //temp login
    const identifiedUser = DUMMY_USERS.find(u => {
        return u.email === email
    });
    console.log(identifiedUser);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identified user, authentication failed', 401);
    }

    res.json({ message: 'logged in!' });
}

exports.getUserByUserId = getUserByUserId;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;