const express = require('express');
const router = express.Router();
const { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace } = require('../controllers/places-controller')


//get place by id
router.get('/:pid', getPlaceById);

//get place by user id
router.get('/user/:uid', getPlacesByUserId);

router.post('/', createPlace);

router.patch('/:pid', updatePlace);

router.delete('/:pid', deletePlace);

module.exports = router;