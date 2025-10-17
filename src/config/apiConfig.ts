// API Configuration - All values come from environment variables
export const API_CONFIG = {
  // Base URL from environment - Use proxy for both development and production
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // API Token from environment
  TOKEN: import.meta.env.VITE_API_TOKEN || '',
  
  // Header names from environment
  HEADERS: {
    CONTENT_TYPE: 'Content-Type',
    APP_TYPE: import.meta.env.VITE_API_HEADER_APP_TYPE || 'APPType',
    API_TOKEN: import.meta.env.VITE_API_HEADER_API_TOKEN || 'APITocken',
  },
  
  // Request IDs from environment
  REQUEST_IDS: {
    SERVICES: import.meta.env.VITE_API_SERVICES_ID || '16',
    GAZETTE_TYPES: import.meta.env.VITE_API_GAZETTE_TYPES_ID || '0',
  },
  
  // API Endpoints
  ENDPOINTS: {
    GET_SERVICES: 'API/GPLoginweb/API_GetParamDetails',
    GET_GAZETTE_TYPES: 'API/GPLoginweb/API_GazetteList',
    SUBMIT_APPLICATION: 'API/GPLoginweb/API_SubmitApplication',
    VALIDATE_TOKEN: 'API/GPLoginweb/API_ValidateToken',
  }
};

// Environment variables you should set:
// VITE_API_BASE_URL=http://209.236.119.239:2211/
// VITE_API_TOKEN=your-actual-token-here
