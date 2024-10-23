/**
 * Class representing a GPS location.
 */

const allowedAttributes = ["latitude", "longitude", "city", "country"];

class GPSLocation {
  /**
     * Create a GPS location.
     * @param {number} latitude - The latitude of the GPS location.
     * @param {number} longitude - The longitude of the GPS location.
     * @param {string} city - The city of the GPS location.
     * @param {string} country - The country of the GPS location.
     */
  constructor(latitude, longitude, city, country) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.city = city;
    this.country = country;
  }

  static validateData(data) {
    return Object.keys(data).every((key) => allowedAttributes.includes(key));
  }

  /**
   * Create object from data
   */
  static fromData(data) {
    return new GPSLocation(data.latitude, data.longitude, data.city, data.country);
  }

  /**
   * Create map of field
   */
  toJSON() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      city: this.city,
      country: this.country,
    };
  }
}

module.exports = GPSLocation;

