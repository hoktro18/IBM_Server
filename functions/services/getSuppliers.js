require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const axios = require('axios');
const openai = require('openai');
const { getAccessToken, ensureAccessToken } = require('./getAccessToken'); // Assuming this is your access token function

// Function to extract JSON from the response text
const extractJSONFromText = (responseText) => {
    const jsonMatch = responseText.match(/```json(.*?)```/s);
    let jsonString = "";

    if (jsonMatch) {
        jsonString = jsonMatch[1].trim();
    } else {
        console.log("No JSON found in the input.");
    }

    try {
        if (jsonString) {
            const jsonData = JSON.parse(jsonString);
            console.log("Extracted JSON:", JSON.stringify(jsonData, null, 4));
            return jsonData;
        } else {
            console.log("No valid JSON content to parse.");
            return null;
        }
    } catch (error) {
        console.error(`Error parsing JSON: ${error.message}`);
        return null;
    }
};

function getStoredAccessToken() {
    console.log('Reading access token from .env file...');
    const envContent = fs.readFileSync('.env', 'utf8');
    const accessTokenMatch = envContent.match(/ACCESS_TOKEN=(.+)/);
    return accessTokenMatch ? accessTokenMatch[1].trim() : null;
}


// Function to send the prompt to the model
const sendPromptModel = async (prompt) => {
    // Check if access token is available or expired
    ensureAccessToken();
    const accessToken = getStoredAccessToken();
    const url = "https://jp-tok.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";

    const body = {
        "input": prompt,
        "parameters": {
            "decoding_method": "greedy",
            "max_new_tokens": 900,
            "min_new_tokens": 0,
            "stop_sequences": [],
            "repetition_penalty": 1
        },
        "model_id": "meta-llama/llama-3-1-8b-instruct",
        "project_id": "09a5b557-4a50-4e88-8a26-a53cb4b24516"
    };

    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
    };
    console.log(headers);
    try {
        const response = await fetch(url, {
            headers,
            method: "POST",
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.log(response);
            throw new Error(`Non-200 response: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Model response:", data);
        // Extract the `generated_text` from the response
        if (data && data.results && data.results.length > 0) {
            const responseText = data.results[0].generated_text;
            return extractJSONFromText(responseText); // Clean and return the JSON object
        } else {
            throw new Error("No valid results in the response.");
        }

    } catch (error) {
        console.error("Error during model request:", error);
        return null;
    }
};

const sendPromptModelAnother = async (prompt) => {
    console.log(process.env.LLM_API_KEY);
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini', // or 'gpt-4', depending on your API access
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.LLM_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );



        const data = response.data;
        console.log('Model response:', data);
        if (data && data.choices && data.choices.length > 0) {
            const responseText = data.choices[0].message.content;
            return extractJSONFromText(responseText);
        }
        else {
            throw new Error('No valid results in the response.');
        }


    } catch (error) {
        console.error('Error sending prompt to model:', error);
        return null;
    }
};

module.exports = { sendPromptModel, sendPromptModelAnother  };