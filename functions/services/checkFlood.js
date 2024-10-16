const axios = require('axios');

const getFloodData = async (latitude, longitude) => {
  const url = 'https://flood-api.open-meteo.com/v1/flood';
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  try {
    const response = await axios.get(url, {
      params: {
        latitude: latitude,
        longitude: longitude,
        daily: 'river_discharge_max',
        forecast_days: 5
      }
    });

    console.log(response.data);
    let isFlood = false;
    let dailyData = response.data['daily'];
    let floodPeriods = []; // This will store tuples of [start_date, duration]

    for (let i = 0; i < dailyData['time'].length; i++) {
    if (dailyData['river_discharge_max'][i] > 3000) {
        
        
        let start_date = dailyData['time'][i];
        let duration = 1; // Initialize duration to 1 (as the current day is part of the flood)
        
        // Check consecutive flood days to calculate the duration
        while (i + 1 < dailyData['time'].length && dailyData['river_discharge_max'][i + 1] > 3000) {
            isFlood = true;
            duration++;
            i++; // Move to the next day
        }
        
        // Push the tuple [start_date, duration] to the floodPeriods array
        floodPeriods.push([start_date, duration]);
    }
    }


    
    return [isFlood, floodPeriods];

  } catch (error) {
    console.error('Error fetching flood data:', error);
  }
};

module.exports = { getFloodData };