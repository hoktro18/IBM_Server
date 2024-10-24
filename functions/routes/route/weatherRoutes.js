/* eslint-disable new-cap */
const express = require("express");

const router = express.Router();
/*
*****************************
    CREATE FUNCTION
*****************************
*/



const { getStormInfo, checkStorm } = require("../../services/checkStorm")
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

const { getFloodData } = require("../../services/checkFlood")
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

const { sendPromptModel, sendPromptModelAnother } = require('../../services/getSuppliers');
router.post("/getsuppliers", async (req, res) => {
    const jsonData = req.body;

    // Extract day and members from the JSON data
    const { latitude, longitude, day, members } = jsonData;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    // Check if day and members are provided
    if (!day || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ error: "Day and members are required." });
    }
    let day1=0;
    let checkStormData = await checkStorm(latitude, longitude);
    console.log('checkStormData');
    let checkFloodData = await getFloodData(latitude, longitude);
    console.log('checkFloodData');

    if (checkStormData[0] != 0 || checkFloodData[0] != false) {
        if (checkStormData[0] == 2) {
            day1 = checkStormData[2] - checkStormData[1] + 1;
            for (let i = 0; i < checkFloodData[1].length; i++) {
                day1 += checkFloodData[1][i][1];
            }
        }
    }
    console.log(day1);
    console.log(day);
    if (day1 !=0)
        day = day1;
    // Construct the prompt using the extracted data, excluding HealthName
    const memberDetails = members.map(member => `${member.HealthGender}, ${member.HealthAge} years old,  weighing ${member.HealthWeight}kg and ${member.HealthHeight}cm tall`).join('; ');

    const prompt = `
Given an imminent flood and storm in ${day} days, a family of ${members.length} members is preparing for a ${day}-day survival period. 
${memberDetails}
Provide a list of essential items in three categories: food, clothing, and other_supplies.
The food should meet their daily caloric requirements based on their weights, and clothing should protect them from heavy rain and cold temperatures. 
Include relevant suppliers for each item. Return the results in a JSON format only with the following structure: item, quantity, and description. All values in JSON format should be strings, wrapped by " and ".
Not a python file. Do not yapping.

`;
    console.log(prompt);
    // create json object
    
    try {
        const response = await sendPromptModelAnother(prompt);
        res.json(response);

        console.log(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking the suppliers' });
    }

    // const survivalSupplies = {
    //     food: [
    //         {
    //             item: "Canned beans",
    //             quantity: "20",
    //             description: "High in protein and can be stored for a long time"
    //         },
    //         {
    //             item: "Peanut butter",
    //             quantity: "5",
    //             description: "High calorie, protein source, and does not require cooking"
    //         },
    //         {
    //             item: "Canned vegetables",
    //             quantity: "20",
    //             description: "Provides essential nutrients and can be eaten right from the can"
    //         },
    //         {
    //             item: "Rice",
    //             quantity: "5kg",
    //             description: "Non-perishable carbohydrate source"
    //         },
    //         {
    //             item: "Dried fruits",
    //             quantity: "2kg",
    //             description: "High in calories and sugars for quick energy"
    //         },
    //         {
    //             item: "Instant oatmeal",
    //             quantity: "10 packets",
    //             description: "Quick to prepare breakfast option"
    //         },
    //         {
    //             item: "Water",
    //             quantity: "100 liters",
    //             description: "Essential for hydration during the survival period"
    //         }
    //     ],
    //     clothing: [
    //         {
    //             item: "Rain jackets",
    //             quantity: "5",
    //             description: "Waterproof jackets to protect from rain"
    //         },
    //         {
    //             item: "Warm fleece jackets",
    //             quantity: "5",
    //             description: "Keeps warm during cold temperatures"
    //         },
    //         {
    //             item: "Waterproof boots",
    //             quantity: "5 pairs",
    //             description: "Prevents wet feet and keeps warm"
    //         },
    //         {
    //             item: "Thermal socks",
    //             quantity: "10 pairs",
    //             description: "Provides insulation and keeps feet warm"
    //         },
    //         {
    //             item: "Hats",
    //             quantity: "5",
    //             description: "Protects from the rain and adds warmth"
    //         }
    //     ],
    //     other_supplies: [
    //         {
    //             item: "First aid kit",
    //             quantity: "1",
    //             description: "For treating minor injuries and medical emergencies"
    //         },
    //         {
    //             item: "Flashlights",
    //             quantity: "5",
    //             description: "For lighting in case of power failure"
    //         },
    //         {
    //             item: "Batteries",
    //             quantity: "20",
    //             description: "For powering flashlights and other devices"
    //         },
    //         {
    //             item: "Multi-tool",
    //             quantity: "1",
    //             description: "Versatile tool for various tasks"
    //         },
    //         {
    //             item: "Portable phone charger",
    //             quantity: "2",
    //             description: "For charging mobile devices"
    //         },
    //         {
    //             item: "Plastic tarps",
    //             quantity: "2",
    //             description: "Can be used for shelter or covering supplies"
    //         }
    //     ]
    // };
    
    // Returning the JSON object
    // res.json(JSON.stringify(survivalSupplies, null, 2));
    
});
module.exports = router;