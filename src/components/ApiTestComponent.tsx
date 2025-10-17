import React, { useState, useEffect } from 'react';
import ApiService from '../services/apiService';

const ApiTestComponent: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing API with getAllGazetteTypes...');
      const response = await ApiService.getAllGazetteTypes("59");
      console.log('API Response:', response);
      console.log('Response success:', response.success);
      console.log('Response data length:', response.data?.length);
      console.log('First plan:', response.data?.[0]);
      setApiResponse(response);
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testIndividualPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing individual payment plans...');
      const plans = ["64", "65", "66"];
      const responses = await Promise.all(
        plans.map(async (plan) => {
          const response = await ApiService.getGazetteTypes("59", plan);
          return { plan, response };
        })
      );
      console.log('Individual Plan Responses:', responses);
      setApiResponse({ individualPlans: responses });
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testApi();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">API Test Component</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testApi}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test getAllGazetteTypes'}
        </button>
        
        <button
          onClick={testIndividualPlans}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-4"
        >
          {loading ? 'Testing...' : 'Test All PaymentPlans (64, 65, 66)'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {apiResponse && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">API Response:</h3>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent;
