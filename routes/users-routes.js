const express = require('express');
const router = express.Router();
const { getUserByUserId, getUsers, signup, login } = require('../controllers/users-controller');
const { check } = require('express-validator');

router.get('/', getUsers);

router.post('/signup',
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 })
    ]
    , signup);

router.post('/login', login);

router.get('/:uid', getUserByUserId);

module.exports = router;