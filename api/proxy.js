export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, APPType, APITocken');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get the path from the request
    const path = req.url.replace('/api/', '');
    const targetUrl = `http://209.236.119.239:2211/API/${path}`;
    
    console.log('Proxying request to:', targetUrl);
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);

    // Forward the request to the target server
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'APPType': 'WEB',
        'APITocken': 'AyTRfghyNoo987-ghtuHH86YYR', 
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Get the response data
    const data = await response.text();
    
    // Set the response status and headers
    res.status(response.status);
    
    // Copy relevant headers from the target response
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Send the response
    res.send(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      success: false 
    });
  }
}
