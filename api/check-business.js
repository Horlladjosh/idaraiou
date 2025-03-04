import fetch from 'node-fetch';

export default async function handler(req, res) {
  // CORS Configuration
  const ALLOWED_ORIGIN = '*';

  // Handle CORS Preflight
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Immediately respond to OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Ensure only POST requests are processed
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // Robust body parsing
    const body = typeof req.body === 'string' 
      ? JSON.parse(req.body) 
      : req.body;

    const { businessName, lineOfBusiness } = body;

    // Input validation
    if (!businessName || !lineOfBusiness) {
      return res.status(400).json({ 
        error: 'Business name and business type are required',
        receivedData: { businessName, lineOfBusiness }
      });
    }

    // External API call
    const apiResponse = await fetch(process.env.BN_COMPLIANCE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.BN_COMPLIANCE_API_KEY,
        'Accept': 'application/json',
        'X_API_KEY': process.env.BN_COMPLIANCE_API_KEY
      },
      body: JSON.stringify({
        proposedName: businessName,
        lineOfBusiness: lineOfBusiness
      })
    });

    const data = await apiResponse.json();

    // Return successful response
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);

    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}