/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const UserAccount = require("@models/class/userAccount");

/*
*****************************
    CREATE FUNCTION
*****************************
*/
// Create a new user
router.post("/create", async (req, res) => {
  console.log(req.body);
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

/*
*****************************
    READ FUNCTION
*****************************
 */
// Get single user by userID
router.get("/get/:userId", async (req, res) => {
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

// Get all users
router.get("/getAll", async (req, res) => {
  console.log("Get all users");
  (async () => {
    try {
      const users = await UserAccount.getAll();
      return res.status(200).send({status: "Success", data: users});
    } catch (error) {
      console.log(error);
      return res.status(500).send({success: "Failed", message: error});
    }
  })();
});

/*
*****************************
    UPDATE FUNCTION
*****************************
*/
// Update single user by userID
router.put("/update/:userId", async (req, res) => {
  (async () => {
    try {
      await UserAccount.update(req.params.userId, req.body);
      return res.status(200).send({success: "Success", message: "User updated successfully"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({success: "Failed", message: error});
    }
  })();
});

// Update location of single user by userID
router.put("/updateLocation/:userId", async (req, res) => {
  (async () => {
    try {
      await UserAccount.updateLocation(req.params.userId, req.body);
      return res.status(200).send({success: "Success", message: "User location updated successfully"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({success: "Failed", message: error});
    }
  })();
});

/*
*****************************
    DELETE FUNCTION
*****************************
*/
// Delete single user by userID
router.delete("/delete/:userId", async (req, res) => {
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

module.exports = router;
