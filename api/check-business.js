// File: /api/check-business.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { businessName, lineOfBusiness } = req.body;
    
    // Validate input
    if (!businessName || !lineOfBusiness) {
      return res.status(400).json({ error: 'Business name and type are required' });
    }

    // Your API key and URL are now securely stored server-side
    const apiKey = process.env.BN_COMPLIANCE_API_KEY;
    const apiUrl = process.env.BN_COMPLIANCE_API_URL;

    // Make the API request from the server
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
        'Accept': 'application/json',
        'X_API_KEY': apiKey
      },
      body: JSON.stringify({
        proposedName: businessName,
        lineOfBusiness: lineOfBusiness
      })
    });

    const data = await response.json();
    
    // Return the API response to the client
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in API proxy:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
I