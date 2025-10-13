# API Configuration Guide

## Current Configuration
The application is now configured to use a Vite proxy to avoid CORS issues. The proxy forwards requests from `/api/` to `http://209.236.119.239:2211/`.

## How It Works
- **Frontend requests**: `http://localhost:5173/api/API/GPLoginweb/API_GetParamDetails`
- **Proxy forwards to**: `http://209.236.119.239:2211/API/GPLoginweb/API_GetParamDetails`
- **No CORS issues**: Since the request appears to come from the same origin

## Configuration Options

### Option 1: Use Proxy (Current - Recommended)
The application uses `/api/` which is proxied to the actual API server.

### Option 2: Override with Environment Variable
Create a `.env` file in your project root to override the default:

```env
VITE_API_BASE_URL=http://209.236.119.239:2211/
```

**Note**: Direct API calls will cause CORS errors unless the server is configured to allow your origin.

## API Server Information
- **Actual API Server**: `http://209.236.119.239:2211/`
- **Proxy Target**: `/api/` → `http://209.236.119.239:2211/`
- **Server Type**: Test Site (as indicated by the website)
- **Company**: Powered by Nacasky Company Ltd.

## After Configuration

1. Restart your development server (`npm run dev`)
2. Check the browser console for the actual API URL being used
3. Verify your API server is running and accessible

## Troubleshooting

- **ERR_NAME_NOT_RESOLVED**: API server URL is incorrect or server is not running
- **Failed to fetch**: Network connectivity issues or CORS problems
- **401 Unauthorized**: API token is invalid or expired
- **500 Internal Server Error**: Backend server issues
- **"The given header was not found"**: Header name mismatch (server expects `APITocken`, not `APIToken`)

## Important Notes

- The server expects the header `APITocken` (with typo), not `APIToken`
- This is a server-side requirement that must be matched exactly
- The proxy is working correctly - requests are being forwarded successfully

## Current API Endpoints

The application makes requests to:
- `API/GPLoginweb/API_GetParamDetails` (GET services)
- `API/GPLoginweb/API_GazetteList` (GET gazette types)
- `API/GPLoginweb/API_SubmitApplication` (POST application)

Ensure your API server supports these endpoints.
