import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ApiService from '../services/apiService';
import { API_CONFIG } from '../config/apiConfig';

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);

  const addResult = (test: string, result: any) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const testApiConnection = async () => {
    const loadingToast = toast.loading('Testing API connection...');
    
    try {
      console.log('=== API Configuration ===');
      console.log('Base URL:', API_CONFIG.BASE_URL);
      console.log('Token:', API_CONFIG.TOKEN);
      console.log('Headers:', API_CONFIG.HEADERS);
      console.log('Request IDs:', API_CONFIG.REQUEST_IDS);
      
      addResult('Configuration', {
        baseUrl: API_CONFIG.BASE_URL,
        token: API_CONFIG.TOKEN,
        headers: API_CONFIG.HEADERS,
        requestIds: API_CONFIG.REQUEST_IDS
      });

      // Test services endpoint
      toast.dismiss(loadingToast);
      const servicesToast = toast.loading('Testing services endpoint...');
      
      const servicesResponse = await ApiService.getServices();
      console.log('Services response:', servicesResponse);
      
      addResult('Services API', servicesResponse);
      
      toast.dismiss(servicesToast);
      
      if (servicesResponse.success) {
        toast.success(`Services API works! Found ${servicesResponse.data.length} services`);
      } else {
        toast.error(`Services API failed: ${servicesResponse.error}`);
      }

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('API test error:', error);
      addResult('Error', { message: error instanceof Error ? error.message : 'Unknown error' });
      toast.error(`API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testTokenValidation = async () => {
    const loadingToast = toast.loading('Testing token validation...');
    
    try {
      const response = await ApiService.validateToken();
      console.log('Token validation response:', response);
      
      addResult('Token Validation', response);
      
      toast.dismiss(loadingToast);
      
      if (response.success) {
        toast.success('Token is valid!');
      } else {
        toast.error(`Token validation failed: ${response.error}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Token validation error:', error);
      addResult('Token Validation Error', { message: error instanceof Error ? error.message : 'Unknown error' });
      toast.error(`Token validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Base URL:</strong> {API_CONFIG.BASE_URL}</p>
            <p><strong>Token:</strong> {API_CONFIG.TOKEN}</p>
            <p><strong>API Token Header:</strong> {API_CONFIG.HEADERS.API_TOKEN}</p>
            <p><strong>Services Request ID:</strong> {API_CONFIG.REQUEST_IDS.SERVICES}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button
              onClick={testApiConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Test Services API
            </button>
            <button
              onClick={testTokenValidation}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Test Token Validation
            </button>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No test results yet. Run a test to see results here.</p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{result.test}</h3>
                  <p className="text-sm text-gray-600 mb-2">{result.timestamp}</p>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
