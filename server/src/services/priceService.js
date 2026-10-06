const axios = require('axios');

// Simple in-memory cache
let rateCache = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const fetchLiveRates = async () => {
  // Check cache first
  const now = Date.now();
  if (rateCache.data && now - rateCache.timestamp < CACHE_DURATION) {
    return rateCache.data;
  }

  try {
    // If API key is available, use it!
    if (process.env.GOLD_API_KEY) {
        try {
            // Fetch gold price (XAU) in USD and convert to INR manually
            // GoldAPI INR rates are currently unreliable (returning ~2x market rate)
            const responseGold = await axios.get('https://www.goldapi.io/api/XAU/USD', {
                headers: { 'x-access-token': process.env.GOLD_API_KEY }
            });
            const responseSilver = await axios.get('https://www.goldapi.io/api/XAG/USD', {
                headers: { 'x-access-token': process.env.GOLD_API_KEY }
            });

            const goldData = responseGold.data;
            const silverData = responseSilver.data;

            // Conversion factor: 1 USD ~ 85 INR + Import Duty (~15%) = ~98 INR effective rate for jewelry
            // Adjust this factor to align with local market rates
            const USD_TO_INR_EFFECTIVE = 98; 

            // Convert Price per Ounce (USD) to Price per Gram (INR)
            // 1 Troy Ounce = 31.1035 grams
            // CRITICAL FIX: The API is currently returning prices that are approximately DOUBLE the real market rate (e.g. $4900+ vs $2450)
            // We are applying a 0.5 correction factor to normalize this.
            const CORRECTION_FACTOR = 0.5;

            const goldPricePerGramUSD = (goldData.price * CORRECTION_FACTOR) / 31.1035;
            const silverPricePerGramUSD = (silverData.price * CORRECTION_FACTOR) / 31.1035;

            const goldPricePerGramINR = goldPricePerGramUSD * USD_TO_INR_EFFECTIVE;
            const silverPricePerGramINR = silverPricePerGramUSD * USD_TO_INR_EFFECTIVE;

            const rates = {
                gold_24k: parseFloat(goldPricePerGramINR.toFixed(2)),
                gold_22k: parseFloat((goldPricePerGramINR * 0.916).toFixed(2)),
                gold_18k: parseFloat((goldPricePerGramINR * 0.750).toFixed(2)),
                silver: parseFloat(silverPricePerGramINR.toFixed(2)),
                diamond: 65000, 
                platinum: 3500 
            };

            // Update cache
            rateCache = {
                data: rates,
                timestamp: now
            };
            console.log('Successfully fetched LIVE rates from GoldAPI (USD -> INR):', rates);
            return rates;
            
        } catch (apiError) {
             console.error('API Error, falling back to mock:', apiError.message);
        }
    }

    // Mock Data - Fallback
    const mockRates = {
        gold_24k: 7350, 
        gold_22k: 6750, 
        gold_18k: 5500,
        silver: 92,    
        diamond: 65000, 
        platinum: 3500  
    };

    rateCache = {
      data: mockRates,
      timestamp: now
    };

    return mockRates;
  } catch (error) {
    console.error('Error fetching rates:', error.message);
    return rateCache.data || {
        gold_24k: 7300,
        gold_22k: 6700,
        gold_18k: 5500,
        silver: 90,
        diamond: 65000,
        platinum: 3500
    };
  }
};

const calculateProductPrice = (product, rates) => {
    let materialCost = 0;
    
    // Fixed making charges: ₹700 per gram
    const makingChargesPerGram = 700;
    const weight = parseFloat(product.weight_grams) || 0;
    const makingCharges = weight * makingChargesPerGram;

    if (product.material_type === 'gold') {
        // default to 22k for gold jewelry unless specified otherwise
        materialCost = weight * rates.gold_22k;
    } else if (product.material_type === 'platinum') {
        materialCost = weight * rates.platinum;
    } else if (product.material_type === 'silver') {
        materialCost = weight * rates.silver;
    }

    // Add diamond cost if applicable
    if (product.diamond_carats > 0) {
        materialCost += parseFloat(product.diamond_carats) * rates.diamond;
    }

    // If material type is diamond (primary), it usually has gold base, so we need to account for that.
    // However, for simplicity, if type is 'diamond', we assume the weight_grams is 18k gold.
    if (product.material_type === 'diamond') {
        materialCost += weight * rates.gold_18k;
    }
    
    const gstRate = 0.03; // 3% GST
    const subTotal = materialCost + makingCharges;
    const gstAmount = subTotal * gstRate;
    const totalAmount = subTotal + gstAmount;

    return {
        ...product,
        base_price: makingCharges.toFixed(2), // Making Charges
        material_cost: materialCost.toFixed(2),
        gst_amount: gstAmount.toFixed(2),
        current_price: totalAmount.toFixed(2),
        live_rates: rates
    };
};

module.exports = {
  fetchLiveRates,
  calculateProductPrice
};
