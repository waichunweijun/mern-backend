const axios = require('axios');
const apiKeyCredential = require('../credentials/apiKeyCredential');
const API_KEY = apiKeyCredential.API_KEY;
const HttpError = require('../models/http-error');

async function getCoordsForAddress(address) {
    /**
     *  encodes a URI by replacing each instance of certain 
     * characters by one, two, three, or four escape sequences representing the UTF-8 encoding of the character 
     * (will only be four escape sequences for characters composed of two "surrogate" characters).
     */
    address = encodeURIComponent(address);
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`);

    const data = response.data;

    console.log(data);

    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new HttpError('Could not find location for the specified address', 422);
        throw error;
    }

    const coordinates = data.results[0].geometry.location;
    return coordinates;

}


module.exports = getCoordsForAddress;