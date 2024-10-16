const axios = require('axios');
require('dotenv').config(); // Load environment variables

// Function to check storm status using an external API
// Function to get storm information from OpenWeatherMap
const getStormInfo = async (latitude, longitude) => {
    const apiKey = process.env.OPENWEATHER_API_KEY; // Replace with your actual OpenWeatherMap API key
    // console.log("API KEY: ", apiKey)
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(response.data);
            },1000);
        })
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data');
    }
};

const checkStorm = (latitude, longitude) => {
    const isStorm = false;
    const day = 0;

    const dailyForcast = getStormInfo(latitude, longitude).then((data) => {
        data.daily; 
        for (let element of data.daily){
            if (element['wind_speed'] >= 17.5){
                isStorm = true;
                day++;
            }
        };
    });
    //const dailyForcast = weatherInfo['daily'].then((array)=>console.log(array));
    // console.log(dailyForcast)
    
    return [isStorm, day];
};

module.exports = { getStormInfo, checkStorm};
