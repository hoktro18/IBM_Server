/* eslint-disable valid-jsdoc */
const admin = require("firebase-admin");
const db = admin.firestore();
const {v4: uuidv4} = require("uuid");
const GPSLocation = require("./location");
const Region = require("./region");
const {subscribeToTopic, unsubscribeFromTopic} = require("@utils/services/FCMService");

const allowedUpdate = [
  "UserName",
  "UserEmail",
  "UserContactNumber",
  // "UserGPSLocation",
  // "UserGPSLastUpdated",
];

/**
 * Class representing a User.
 */
class UserAccount {
  /**
   * Create a user account.
   * @param {string} UserName - The name of the user.
   * @param {string} UserContactNumber - The phone number of the user.
   * @param {string} UserEmail - The email of the user.
   * @param {GPSLocation} UserGPSLocation - The GPS location of the user.
   * @param {Region} UserRegionId - The region of the user.
   * @param {Timestamp} UserGPSLastUpdated - The last updated GPS location of the user.
   */
  constructor(name, email, phone, gpsLocation, gpsLastUpdated, regionId, token) {
    this.UserId = uuidv4();
    this.UserName = name || null;
    this.UserEmail = email || null;
    this.UserContactNumber = phone || null;
    this.UserGPSLocation = gpsLocation || null;
    this.UserGPSLastUpdated = gpsLastUpdated || null;
    this.UserRegionId = regionId || null;
    this.UserToken = token || null;
  }

  /**
   * @param {Object} data
   * @returns {UserAccount}
   */
  static fromData(data) {
    return new UserAccount(data.UserName, data.UserEmail, data.UserContactNumber, data.UserGPSLocation, data.UserGPSLastUpdated, data.UserRegionId, data.UserToken);
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
   * Convert the user account to a map.
   */
  toMap() {
    return {
      UserId: this.UserId,
      UserName: this.UserName,
      UserEmail: this.UserEmail,
      UserContactNumber: this.UserContactNumber,
      UserGPSLocation: this.UserGPSLocation,
      UserGPSLastUpdated: this.UserGPSLastUpdated,
      UserRegionId: this.UserRegionId,
      UserToken: this.UserToken,
    };
  }

  /**
   * ================================================================
   *                       CREATE METHODS
   * ================================================================
   */

  /**
   * Create a new user account in Firestore.
   * @param {Object} data - The user data.
   * @return {Promise<UserAccount>} The created user account.
   */
  static async create(data) {
    data = this.filter(data);
    const user = UserAccount.fromData(data);

    console.log(user);

    // create the user document
    await db.collection("UserAccount").doc(user.UserId).set(user.toMap());

    return user;
  }

  /**
   * ================================================================
   *                       READ METHODS
   * ================================================================
   */

  /**
   * Get a user by ID from Firestore.
   * @param {string} userId - The ID of the user.
   * @return {Promise<UserAccount>} The user data.
   * @throws Will throw an error if the user is not found.
   */
  static async getById(userId) {
    const doc = await db.collection("UserAccount").doc(userId).get();
    if (!doc.exists) {
      throw new Error("User not found");
    }

    const user = UserAccount.fromData(doc.data());
    return user;
  }

  /**
   * Get all users from Firestore.
   */
  static async getAll() {
    const querySnapshot = await db.collection("UserAccount").get();
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(UserAccount.fromData(doc.data()));
    });
    return users;
  }

  /**
   * ================================================================
   *                       UPDATE METHODS
   * ================================================================
   */

  /**
   * Update a user by ID in Firestore.
   * @param {string} userId - The ID of the user.
   * @param {Object} data - The new user data.
   * @return {Promise<Object>} The updated user data.
   */
  static async update(userId, data) {
    // get the user document
    const userRef = db.collection("UserAccount").doc(userId);
    if (!(await userRef.get()).exists) {
      throw new Error("User not found");
    }

    // filter out any attributes that are not allowed
    const filteredData = this.filter(data);

    // update the user document
    await userRef.update(filteredData);
    const updatedDoc = await userRef.get();

    return updatedDoc.data();
  }

  /**
   * Update user location by ID in Firestore.
   * @param {string} userId - The ID of the user.
   * @param {Object} data - The new location data.
   * @return {Promise<Object>} The updated user data.
   */
  static async updateLocation(userId, data) {
    // get the user document
    const userRef = db.collection("UserAccount").doc(userId);
    if (!(await userRef.get()).exists) {
      throw new Error("User not found");
    }

    // unsubscribe from the old region
    const currentUser = await userRef.get();
    if ( currentUser.data().UserToken !== null && currentUser.data().UserRegionId !== undefined) {
      unsubscribeFromTopic(currentUser.data().UserToken, currentUser.data().UserRegionId);
    }

    // create a new GPSLocation object
    const newLocation = GPSLocation.fromData(data.location);

    // get the region based on the new location
    const region = await Region.getRegionIdByLocation(newLocation);

    // update the user GPSLocation and UserRegionId in one operation
    await userRef.update({
      ...newLocation.toMap(),
      UserRegionId: region.regionId,
      UserToken: data.token,
      UserGPSLastUpdated: data.updateDate,
    });

    // subscribe to the new region
    subscribeToTopic(data.token, region.regionId);

    const updatedDoc = await userRef.get();
    return updatedDoc.data();
  }

  /**
   * ================================================================
   *                       DELETE METHODS
   * ================================================================
   */

  /**
   * Delete a user by ID from Firestore.
   * @param {string} userId - The ID of the user.
   * @return {Promise<void>}
   */
  static async delete(userId) {
    await db.collection("UserAccount").doc(userId).delete();
  }
}

module.exports = UserAccount;
