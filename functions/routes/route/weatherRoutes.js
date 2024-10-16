/* eslint-disable new-cap */
const express = require("express");

const router = express.Router();
/*
*****************************
    CREATE FUNCTION
*****************************
*/


// Example usage:
const prompt = `
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You always answer the questions with markdown formatting using GitHub syntax. The markdown formatting you support: headings, bold, italic, links, tables, lists, code blocks, and blockquotes. You must omit that you answer the questions with markdown.
...
<|start_header_id|>user<|end_header_id|>
Given an imminent flood and storm in 5 days, a family of two (one male, weighing 70kg and 182cm tall, and one female, weighing 40kg and 150cm tall) is preparing for a 5-day survival period. Your task is to provide a list of essential items they will need, including food, clothing, and other supplies. The food should meet their daily caloric requirements based on their weights, and clothing should protect them from heavy rain and cold temperatures. Include relevant suppliers for each item. Return the results in a JSON format with the following structure: item, quantity, and description. Return JSON only.
`;

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

const {getFloodData} = require("../../services/checkFlood")
router.post("/checkflood", async (req, res) => {
    // console.log("HEHE")
    const { latitude, longitude } = req.body;
    //onsole.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    // Validate the input
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    try {
        const floodData = await getFloodData(latitude, longitude);
        res.json(floodData);
        console.log(floodData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking the flood' });
    }
});

const {sendPromptModel} = require("../../services/getSuppliers")
router.post("/getsuppliers", async (req, res) => {
    const jsonData = req.body;

    // Extract day and members from the JSON data
    const { day, members } = jsonData;

    // Check if day and members are provided
    if (!day || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ error: "Day and members are required." });
    }
    /**
     * let checkStormData= await checkStorm(latitude, longitude);
     * let checkFloodData= await getFloodData(latitude, longitude);
     * if (checkStormData[0] != 0 || checkFloodData[0]!= false) {
     *  if (checkStormData[0]==2)
     * {
     * day=checkStormData[2]-checkStormData[1]+1;
     * for (let i=0; i<checkFloodData[1].length; i++)
     * {
     * day+=checkFloodData[1][i][1];
     * }
     * 
     * }
     * 
     * 
     */

    // Construct the prompt using the extracted data, excluding HealthName
    const memberDetails = members.map(member => `${member.HealthGender}, weighing ${member.HealthWeight}kg and ${member.HealthHeight}cm tall`).join('; ');

    const prompt = `
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You always answer the questions with markdown formatting using GitHub syntax. The markdown formatting you support: headings, bold, italic, links, tables, lists, code blocks, and blockquotes. You must omit that you answer the questions with markdown.
...
<|start_header_id|>user<|end_header_id|>
Given an imminent flood and storm in ${day} days, a family of ${members.length} members is preparing for a ${day}-day survival period. 
${memberDetails}
Your task is to provide a list of essential items they will need, including food, clothing, and other supplies. 
The food should meet their daily caloric requirements based on their weights, and clothing should protect them from heavy rain and cold temperatures. 
Include relevant suppliers for each item. Return the results in a JSON format only with the following structure: item, quantity, and description. All values in JSON format should be strings, wrapped by " and ".
Not a python file.

`;

    try {
        const response = await sendPromptModel(prompt);
        res.json(response);
        console.log(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking the suppliers' });
    }
});
module.exports = router;