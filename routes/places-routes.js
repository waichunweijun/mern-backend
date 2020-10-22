const express = require('express');

const router = express.Router();


router.get('/', (req, res, next) => {
    console.log('get request in places');
    //send back response immediately
    res.json({ message: "success!" });
});


module.exports = router;