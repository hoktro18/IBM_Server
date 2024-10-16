const axios = require('axios');

const getFloodData = async (latitude, longitude) => {
  const url = 'https://flood-api.open-meteo.com/v1/flood';

  try {
    const response = await axios.get(url, {
      params: {
        latitude: latitude,
        longitude: longitude,
        daily: 'river_discharge_max',
        forecast_days: 7
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching flood data:', error);
  }
};

module.exports = { getFloodData };