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


// If return 0 => No storm
// other, return 3D-tuple: [level of storm (1,2,3), start day of the storm. end Day of the storm]. Note, as increasing of storm level, as 
const checkStorm = (latitude, longitude) => {
    let stormLevel = 0;
    let firstCount = false;

    let counter = 0, startDay = 0;
    let maxWind = 0;

    getStormInfo(latitude, longitude).then((data) => { 
        for (let element of data.daily){
            let tempStormDuration = []
            if (element['wind_speed'] >= 17.5){       
                if (firstCount == false) {
                    startDay = counter;
                    firstCount = true;
                }
                counter ++;

                if (maxWind < element['wind_speed']) maxWind = element['wind_speed'];
            } else {
                if (firstCount == false) continue;

                if (maxWind <= 24.7) stormLevel = 1;
                else if (maxWind <= 32.7) stormLevel = 2;
                else stormLevel = 3;
                return [stormLevel, startDay, counter];
            }
        };
    });
    
    return 0;
};

module.exports = { getStormInfo, checkStorm};
