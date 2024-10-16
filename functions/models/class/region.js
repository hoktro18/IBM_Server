const admin = require("firebase-admin");
const db = admin.firestore();
const {v4: uuidv4} = require("uuid");

const allowedUpdate = [
  "regionStatus",
  "regionStatusLastUpdated",
];

/**
 * Class representing a region.
 */

class Region {
  /**
   * @param {string} regionId - The id of the region.
   * @param {string} regionCity - The city of the region.
   * @param {string} regionCountry - The country of the region.
   * @param {GPSLocation} regionGPSLocation - The GPS location of the region.
   * @param {string} regionStatus - The status of the region.
   * @param {Timestamp} regionStatusLastUpdated - The last updated status of the region.
  */

  constructor(gpsLocation, status, statusLastUpdated) {
    this.regionId = uuidv4();
    this.regionGPSLocation = gpsLocation;
    this.regionCity = gpsLocation.city;
    this.regionCountry = gpsLocation.country;
    this.regionStatus = status;
    this.regionStatusLastUpdated = statusLastUpdated;
  }

  /**
   * Create object from data
   */
  static fromData(data) {
    return new Region(data.regionGPSLocation, data.regionStatus, data.regionStatusLastUpdated);
  }

  /**
   * Filter out any attributes that are not allowed
   */
  static filter(data) {
    return Object.keys(data).reduce((filteredData, key) => {
      if (allowedUpdate.includes(key)) {
        filteredData[key] = data[key];
      }
      return filteredData;
    }, {});
  }

  /**
   * Convert the region to a map.
   */
  toMap() {
    return {
      regionId: this.regionId,
      regionCity: this.regionCity,
      regionCountry: this.regionCountry,
      regionGPSLocation: this.regionGPSLocation,
      regionStatus: this.regionStatus,
      regionStatusLastUpdated: this.regionStatusLastUpdated,
    };
  }

  /**
   * ================================================================
   *                       CREATE METHODS
   * ================================================================
   */

  /**
   * Create a new region
   */
  static async create(location) {
    // **************************************************
    // NOTE: This is a dummy data. Replace with actual data
    const regionStatus = "Safe";
    const regionStatusLastUpdated = new Date();
    // **************************************************
    const newRegion = new Region(location, regionStatus, regionStatusLastUpdated);
    await db.collection("Region").doc(newRegion.regionId).set(newRegion.toMap());
    return newRegion;
  }

  /**
   * ================================================================
   *                       READ METHODS
   * ================================================================
   */

  /**
   * Get region by id
   */
  static async getById(regionId) {
    const region = await db.collection("Region").doc(regionId).get();
    if (!region.exists) {
      throw new Error("Region not found");
    }
    const regionData = region.data();
    return regionData;
  }

  /**
   * Get the region by location
   */
  static async getRegionIdByLocation(location) {
    let region = await db
        .collection("Region")
        .where("regionCity", "==", location.city)
        .where("regionCountry", "==", location.country)
        .get();

    // Assert that there is only one region
    if (region.size > 1) {
      region = region.docs[0];
    }

    // If there is no region, create a new one
    if (region.empty) {
      region = await Region.create(location);
    }

    return region;
  }
}

module.exports = Region;
