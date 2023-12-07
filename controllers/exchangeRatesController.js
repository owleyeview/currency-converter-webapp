import axios from 'axios';
const API_KEY = process.env.API_KEY;
const BASE_CURRENCY = 'USD';

async function fetchExchangeRates() {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`);
    const date = response.data.time_last_update_utc.substring(5, 16);
    return {
      ...response.data, 
      date, // Add a simplified date property to the response
    };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
}

export async function getExchangeRates(req, res) {
  const rates = await fetchExchangeRates();
  if (rates) {
    res.json(rates);
  } else {
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
}
