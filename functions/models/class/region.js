/* eslint-disable no-unused-vars */
const admin = require("firebase-admin");
const db = admin.firestore();
const {v4: uuidv4} = require("uuid");
const GPSLocation = require("./location");

const allowedUpdate = [
  "regionStatus",
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

  constructor(id, gpsLocation, status, statusLastUpdated) {
    this.regionId = id;
    this.regionGPSLocation = gpsLocation;
    this.regionCity = gpsLocation.city;
    this.regionCountry = gpsLocation.country;
    this.regionStatus = status || "Safe";
    this.regionStatusLastUpdated = statusLastUpdated;
  }

  /**
   * Read object from data
   */
  static readFromData(data) {
    return new Region( data.regionId, data.regionGPSLocation, data.regionStatus, data.regionStatusLastUpdated);
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
  toJSON() {
    return {
      regionId: this.regionId,
      regionCity: this.regionCity,
      regionCountry: this.regionCountry,
      regionGPSLocation: this.regionGPSLocation.toJSON(),
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
    const newRegion = new Region(uuidv4(), location, "Safe", admin.firestore.Timestamp.now());
    await db.collection("Region").doc(newRegion.regionId).set(newRegion.toJSON());
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
    return Region.readFromData(regionData);
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

    console.log(region);

    return region;
  }

  /**
   * Get all regions
   */
  static async getAll() {
    const querySnapshot = await db.collection("Region").get();
    const regions = [];
    querySnapshot.forEach((doc) => {
      regions.push(Region.readFromData(doc.data()));
    });
    return regions;
  }

  /**
   * ================================================================
   *                       UPDATE METHODS
   * ================================================================
   */
  // Update region status
  static async updateStatus(regionId, status) {
    const regionRef = db.collection("Region").doc(regionId);

    // Check if region exists
    if (!(await regionRef.get()).exists) {
      throw new Error("Region not found");
    }

    // Update the region status
    await regionRef.update({
      regionStatus: status,
      regionStatusLastUpdated: admin.firestore.Timestamp.now(),
    });

    // Get the updated region
    const region = await regionRef.get();
    return Region.readFromData(region.data());
  }
}

module.exports = Region;
