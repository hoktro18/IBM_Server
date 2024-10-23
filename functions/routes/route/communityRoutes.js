/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const CommunityBlog = require("@models/class/communityBlog");

/*
*****************************
    CREATE FUNCTION
*****************************
*/
// Create a new blog
router.post("/create", async (req, res) => {
  try {
    const newBlog = await CommunityBlog.create(req.body);
    return res.status(200).send({
      success: "Success",
      message: "Blog created successfully",
      blogId: newBlog.blogId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({success: "Failed", message: error});
  }
});

/*
*****************************
    READ FUNCTION
*****************************
 */
// Get single blog by blogID
router.get("/get/:blogId", async (req, res) => {
  try {
    const blog = await CommunityBlog.fetchById(req.params.blogId);
    return res.status(200).send({status: "Success", data: blog});
  } catch (error) {
    console.log(error);
    return res.status(500).send({success: "Failed", message: error});
  }
});

// Get all blogs
router.get("/getAll", async (req, res) => {
  try {
    const blogs = await CommunityBlog.getAll();
    return res.status(200).send({status: "Success", data: blogs});
  } catch (error) {
    console.log(error);
    return res.status(500).send({success: "Failed", message: error});
  }
});

// Get all blogs by region
router.get("/getAll/:regionId", async (req, res) => {
  try {
    const blogs = await CommunityBlog.getAllByRegion(req.params.regionId);
    return res.status(200).send({status: "Success", data: blogs});
  } catch (error) {
    console.log(error);
    return res.status(500).send({success: "Failed", message: error});
  }
});

/*
*****************************
    UPDATE FUNCTION
*****************************
*/
// Update blog by blogID
router.put("/update/:blogId", async (req, res) => {
  try {
    await CommunityBlog.updateById(req.params.blogId, req.body);
    return res.status(200).send({success: "Success", message: "Blog updated successfully"});
  } catch (error) {
    console.log(error);
    return res.status(500).send({success: "Failed", message: error});
  }
});

/*
*****************************
    DELETE FUNCTION
*****************************
*/
// Delete blog by blogID
router.delete("/delete/:blogId", async (req, res) => {
  try {
    await CommunityBlog.deleteById(req.params.blogId);
    return res.status(200).send({success: "Success", message: "Blog deleted successfully"});
  } catch (error) {
    console.log(error);
    return res.status(500).send({success: "Failed", message: error});
  }
});

// Delete all blogs
router.delete("/deleteAll", async (req, res) => {
  try {
    await CommunityBlog.deleteAll();
    return res.status(200).send({success: "Success", message: "All blogs deleted successfully"});
  } catch (error) {
    console.log(error);
    return res.status(500).send({success: "Failed", message: error});
  }
});

module.exports = router;
