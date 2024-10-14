/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const {UserAccount} = require("@models");

/*
*****************************
    CREATE FUNCTION
*****************************
*/

app.post('/check-storm', async (req, res) => {
    const { latitude, longitude } = req.body;

    // Validate the input
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    try {
        // Step 4: Call the storm detection API
        const stormData = await checkStorm(latitude, longitude);
        res.json(stormData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking the storm' });
    }
});