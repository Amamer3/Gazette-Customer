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
    // Get the path from the request - remove /api/ prefix
    const path = req.url.replace('/api/', '');
    const targetUrl = `http://209.236.119.239:2211/${path}`;
    
    console.log('Original URL:', req.url);
    console.log('Extracted path:', path);
    console.log('Target URL:', targetUrl);
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);

    // Prepare headers for the target server
    const targetHeaders = {
      'Content-Type': 'application/json',
      'APPType': 'WEB',
      'APITocken': 'AyTRfghyNoo987-ghtuHH86YYR'
    };

    // Prepare request body
    let requestBody = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body) {
        requestBody = JSON.stringify(req.body);
      } else {
        // If no body but it's a POST request, send empty JSON object
        requestBody = JSON.stringify({});
      }
    }

    console.log('Request body:', requestBody);
    console.log('Target headers:', targetHeaders);

    // Forward the request to the target server
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: targetHeaders,
      body: requestBody
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
