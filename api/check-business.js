import fetch from 'node-fetch';

export default async function handler(req, res) {
  // CORS configuration
  // Allow multiple origins if needed
  const allowedOrigins = [
    'https://idara.webflow.io',
    'http://localhost:3000',  // for local development
    'https://your-production-domain.com'
  ];

  const origin = req.headers.origin;
  
  // Check if the origin is in the allowed list
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Additional CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Ensure only POST requests are processed
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Detailed logging for debugging
    console.log('Received request body:', req.body);
    console.log('Environment variables:');
    console.log('API Key exists:', !!process.env.BN_COMPLIANCE_API_KEY);
    console.log('API URL exists:', !!process.env.BN_COMPLIANCE_API_URL);

    // Parsing request body (important for Vercel)
    const { businessName, lineOfBusiness } = JSON.parse(req.body);
    
    // Input validation
    if (!businessName || !lineOfBusiness) {
      return res.status(400).json({ 
        error: 'Business name and type are required',
        receivedData: { businessName, lineOfBusiness }
      });
    }

    // Make external API call
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

    // Parse the API response
    const data = await apiResponse.json();

    // Return the parsed data
    return res.status(200).json(data);

  } catch (error) {
    console.error('Detailed error:', error);

    // Improved error response
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      // Only show stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}