/* eslint-disable max-len */
// Set up firebase admin
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Import the express library
const express = require("express");
const cors = require("cors");
const UserAccount = require("./models/userAccount");

// Main App
const app = express();
app.use(cors({origin: true}));

// Routes
app.get("/", (req, res) => {
  return res.status(200).send("Hi there!");
});

// Create -> post()
app.post("/user/create", async (req, res) => {
  (async () => {
    try {
      const newUser = await UserAccount.create(req.body);
      return res.status(200).send({
        success: "Success",
        message: "User created successfully",
        userId: newUser.UserId,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({success: "Failed", message: error});
    }
  })();
});

// Read -> get()
// Fetch - Single Dât from Firestore Database using specific ID
app.get("/user/get/:userId", async (req, res) => {
  (async () => {
    try {
      const userAccount = await UserAccount.getById(req.params.userId);
      return res.status(200).send({status: "Success", data: userAccount});
    } catch (error) {
      console.log(error);
      return res.status(500).send({success: "Failed", message: error});
    }
  })();
});

// Update -> put()

// Delete -> delete()
app.delete("/user/delete/:userId", async (req, res) => {
  (async () => {
    try {
      await UserAccount.delete(req.params.userId);
      return res.status(200).send({success: "Success", message: "User deleted successfully"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({success: "Failed", message: error});
    }
  })();
});

// Export the API to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
