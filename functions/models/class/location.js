
/**
 * @typedef {Object} Location
 * @property {number} lat - The latitude of the GPS location.
 * @property {number} lng - The longitude of the GPS location.
 */

class GPSLocation {
  /**
     * Create a GPS location.
     * @param {Location} location - The location of the GPS.
     * @param {number} radius - The radius of the GPS location.
     */
  constructor(location, radius) {
    this.Location = location || null;
    this.Radius = radius || null;
  }
}

module.exports = GPSLocation;

