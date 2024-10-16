require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
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

// Example usage:
const prompt = `
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You always answer the questions with markdown formatting using GitHub syntax. The markdown formatting you support: headings, bold, italic, links, tables, lists, code blocks, and blockquotes. You must omit that you answer the questions with markdown.
...
<|start_header_id|>user<|end_header_id|>
Do not yapping. Given an imminent flood and storm in 5 days, a family of two (one male, weighing 70kg and 182cm tall, and one female, weighing 40kg and 150cm tall) is preparing for a 5-day survival period. Your task is to provide a list of essential items they will need, including food, clothing, and other supplies. The food should meet their daily caloric requirements based on their weights, and clothing should protect them from heavy rain and cold temperatures. Include relevant suppliers for each item. Return the results in a JSON format only with the following structure: item, quantity, and description. Not a python file.
`;

module.exports = { sendPromptModel };