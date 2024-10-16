/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
/*
*****************************
    CREATE FUNCTION
*****************************
*/

const {getStormInfo,checkStorm} = require("../../services/checkStorm")
router.post("/checkstorm", async (req, res) => {
    // console.log("HEHE")
    const { latitude, longitude } = req.body;

    // Validate the input
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    try {
        const stormData = await checkStorm(latitude, longitude);
        res.json(stormData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking the storm' });
    }
});

const {getFloodInfo} = require("../../services/checkFlood")
router.post("/checkflood", async (req, res) => {
    // console.log("HEHE")
    const { latitude, longitude } = req.body;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    // Validate the input
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    try {
        const floodData = await getFloodInfo(latitude, longitude);
        res.json(floodData);
        console.log(floodData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking the storm' });
    }
});
module.exports = router;