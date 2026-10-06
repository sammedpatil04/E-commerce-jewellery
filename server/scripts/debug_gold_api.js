const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function debugGoldAPI() {
    try {
        console.log("Testing GoldAPI with key:", process.env.GOLD_API_KEY ? "Present" : "Missing");
        
        const responseGoldUSD = await axios.get('https://www.goldapi.io/api/XAU/USD', { headers: { 'x-access-token': process.env.GOLD_API_KEY } });
        
        const priceUSD = responseGoldUSD.data.price;
        const pricePerGramUSD = priceUSD / 31.1035;
        const widthDutyINR = pricePerGramUSD * 98; // 98 is the factor used in priceService.js

        console.log("Gold USD (per Oz):", priceUSD);
        console.log("Gold USD (per g):", pricePerGramUSD.toFixed(2));
        console.log("Calculated INR (per g, 98 factor):", widthDutyINR.toFixed(2));
        
    } catch (error) {
        console.error("API Error:", error.message);
        if (error.response) console.error("Data:", error.response.data);
    }
}

debugGoldAPI();
