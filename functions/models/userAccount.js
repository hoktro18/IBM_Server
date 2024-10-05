/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
const admin = require("firebase-admin");
const db = admin.firestore();
const {v4: uuidv4} = require("uuid");

/**
 * @typedef {Object} GPSLocation
 * @property {number} latitude - The latitude of the GPS location.
 * @property {number} longitude - The longitude of the GPS location.
 */

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
   * @param {Timestamp} UserGPSLastUpdated - The last updated GPS location of the user.
   */
  constructor(name, email, phone, gpsLocation, gpsLastUpdated) {
    this.UserId = uuidv4();
    this.UserName = name;
    this.UserEmail = email;
    this.UserContactNumber = phone;
    this.UserGPSLocation = gpsLocation;
    this.UserGPSLastUpdated = gpsLastUpdated;
  }

  /**
   * Create a new user account in Firestore.
   * @param {Object} data - The user data.
   * @return {Promise<UserAccount>} The created user account.
   */
  static async create(data) {
    const user = new UserAccount(data.UserName, data.UserEmail, data.UserContactNumber, data.UserGPSLocation, data.UserGPSLastUpdated);
    await db.collection("UserAccount").doc(user.UserId).set({
      UserId: user.UserId,
      UserName: user.UserName,
      UserEmail: user.UserEmail,
      UserContactNumber: user.UserContactNumber,
      UserGPSLocation: user.UserGPSLocation,
      UserGPSLastUpdated: user.UserGPSLastUpdated,
    });
    return user;
  }

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
    return doc.data();
  }

  /**
   * Update a user by ID in Firestore.
   * @param {string} userId - The ID of the user.
   * @param {Object} data - The new user data.
   * @return {Promise<Object>} The updated user data.
   */
  static async update(userId, data) {
    const userRef = db.collection("UserAccount").doc(userId);
    await userRef.update(data);
    const updatedDoc = await userRef.get();
    return updatedDoc.data();
  }

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
