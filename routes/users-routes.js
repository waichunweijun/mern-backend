const express = require('express');
const { getUserByUserId, getUsers, signup, login } = require('../controllers/users-controller');



const router = express.Router();

router.get('/', getUsers);

router.post('/signup', signup);

router.post('/login', login);

router.get('/:uid', getUserByUserId);

module.exports = router;