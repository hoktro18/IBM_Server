const axios = require('axios');

// Function to check storm status using an external API
const checkStorm = async (latitude, longitude) => {
    const apiUrl = `https://example-storm-api.com/check?lat=${latitude}&lon=${longitude}`; // Replace with actual API URL

    const response = await axios.get(apiUrl);
    return response.data; // Assuming the API returns the relevant storm information in the response body
};

module.exports = { checkStorm };
