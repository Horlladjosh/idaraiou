// File: /api/check-business.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://idara.webflow.io/');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests (but return a friendly message for GET)
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'This is an API endpoint. Please use POST method with the required parameters.' 
    });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log environment variables (without the actual values for security)
    console.log('API Key exists:', !!process.env.BN_COMPLIANCE_API_KEY);
    console.log('API URL exists:', !!process.env.BN_COMPLIANCE_API_URL);

    const { businessName, lineOfBusiness } = req.body || {};
    
    // Validate input
    if (!businessName || !lineOfBusiness) {
      return res.status(400).json({ 
        error: 'Business name and type are required',
        receivedData: { hasBusinessName: !!businessName, hasLineOfBusiness: !!lineOfBusiness }
      });
    }

    // Rest of your code...
  } catch (error) {
    console.error('Error in API proxy:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
