const axios = require('axios');
require('dotenv').config(); // Load environment variables

// Function to check storm status using an external API
// Function to get storm information from OpenWeatherMap
const getStormInfo = async (latitude, longitude) => {
    const apiKey = process.env.OPENWEATHER_API_KEY; // Replace with your actual OpenWeatherMap API key
    // console.log("API KEY: ", apiKey)
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily&appid=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data');
    }
};
module.exports = { getStormInfo };
