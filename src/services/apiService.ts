import type { GazetteService } from '../types/application';
import { gazettePricingServices } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface ServiceApiResponse {
  SearchDetail: Array<{
    ID: string;
    Nm: string;
  }>;
  success: boolean;
  Message: string;
}

interface GazetteTypeApiResponse {
  SearchDetail: Array<{
    FeeID: string;
    GazzeteType: string;
    PaymentPlan: string;
    GazetteName: string;
    GazetteDetails: string;
    ProcessDays: number;
    GazetteFee: number;
    TaxRate: number;
    DocRequired: Array<{
      ID: string;
      DocName: string;
    }>;
  }>;
  success: boolean;
  Message: string;
}

class ApiService {
  private static readonly API_TOKEN = 'AyTRfghyNoo987-ghtuHH86YYR';
  
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('Making API request to:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check for API errors in response
      if (data.Message && data.Message.includes('error has occurred')) {
        throw new Error(data.Message);
      }
      
      // Check for specific error types
      if (data.ExceptionMessage) {
        throw new Error(data.ExceptionMessage);
      }
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
          errorMessage = 'API server not found. Please check your API_BASE_URL configuration.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check if the API server is running.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        data: null as T,
        error: errorMessage,
      };
    }
  }

  static async getServices(): Promise<ApiResponse<GazetteService[]>> {
    const response = await this.makeRequest<ServiceApiResponse>('API/GPLoginweb/API_GetParamDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'APPType': 'WEB',
        'APITocken': this.API_TOKEN
      },
      body: JSON.stringify({
        "ID": "16"
      })
    });
    
    if (!response.success) {
      return {
        success: false,
        data: [] as GazetteService[],
        error: response.error
      };
    }

    return this.transformServicesResponse(response);
  }

  private static transformServicesResponse(response: ApiResponse<ServiceApiResponse>): ApiResponse<GazetteService[]> {
    if (!response.success || !response.data.success) {
      return {
        success: false,
        data: [] as GazetteService[],
        error: response.data?.Message || response.error || 'Failed to fetch services'
      };
    }

    // Transform the API response to match our GazetteService interface
    const transformedServices: GazetteService[] = response.data.SearchDetail.map((service) => ({
      id: service.ID, // Keep as string
      name: service.Nm,
      description: `Service for ${service.Nm.toLowerCase()}`,
      price: 0, // Will be fetched from a separate API call if needed
      processingTime: 'Processing time will be determined',
      category: 'general', // Default category
      icon: 'FileText', // Default icon
      requiredDocuments: [], // Will be fetched from a separate API call if needed
    }));

    return {
      success: true,
      data: transformedServices,
    };
  }

  static async getServiceById(id: string): Promise<ApiResponse<GazetteService | null>> {
    const servicesResponse = await this.getServices();
    
    if (!servicesResponse.success) {
      return {
        success: false,
        data: null,
        error: servicesResponse.error,
      };
    }

    const service = servicesResponse.data.find(s => s.id === id);
    
    return {
      success: true,
      data: service || null,
    };
  }

  static async getGazetteTypes(gazetteType: string = "0", paymentPlan: string = "0"): Promise<ApiResponse<GazetteTypeApiResponse>> {
    try {
      const response = await this.makeRequest<GazetteTypeApiResponse>('API/GPLoginweb/API_GazetteList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'APPType': 'WEB',
          'APITocken': this.API_TOKEN
        },
        body: JSON.stringify({
          "GazetteType": gazetteType,
          "PaymentPlan": paymentPlan
        })
      });
      
      if (response.success) {
        return response;
      } else {
        console.log('getGazetteTypes - API failed, falling back to mock data');
        return this.getMockGazetteTypes();
      }
    } catch (error) {
      console.log('getGazetteTypes - Network error, falling back to mock data');
      return this.getMockGazetteTypes();
    }
  }

  private static getMockGazetteTypes(): ApiResponse<GazetteTypeApiResponse> {
    const mockResponse: GazetteTypeApiResponse = {
      SearchDetail: gazettePricingServices.map(service => ({
        FeeID: service.id,
        GazzeteType: service.name,
        PaymentPlan: service.gazetteType,
        GazetteName: service.name,
        GazetteDetails: `Service for ${service.name}`,
        ProcessDays: service.gazetteType === 'premium-plus' ? 1 : service.gazetteType === 'premium-gazette' ? 3 : 21,
        GazetteFee: service.price,
        TaxRate: 0.15,
        DocRequired: service.requirements.map(req => ({
          ID: Math.random().toString(36).substr(2, 9),
          DocName: req
        }))
      })),
      success: true,
      Message: 'Mock data loaded successfully'
    };

    return {
      success: true,
      data: mockResponse
    };
  }

  static async submitApplication(applicationData: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.makeRequest<any>('API/GPLoginweb/API_SubmitApplication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'APPType': 'WEB',
          'APITocken': this.API_TOKEN
        },
        body: JSON.stringify(applicationData)
      });
      
      if (response.success) {
        return response;
      } else {
        console.log('submitApplication - API failed, returning mock success');
        return this.getMockSubmissionResponse();
      }
    } catch (error) {
      console.log('submitApplication - Network error, returning mock success');
      return this.getMockSubmissionResponse();
    }
  }

  private static getMockSubmissionResponse(): ApiResponse<any> {
    const mockResponse = {
      ReferenceNumber: `GZ-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      Status: 'Submitted',
      Message: 'Application submitted successfully (using mock data)',
      SubmittedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: mockResponse
    };
  }

  static async validateToken(): Promise<ApiResponse<boolean>> {
    try {
      const response = await this.makeRequest<any>('API/GPLoginweb/API_ValidateToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'APPType': 'WEB',
          'APITocken': this.API_TOKEN
        },
        body: JSON.stringify({})
      });
      
      return {
        success: response.success,
        data: response.success,
        error: response.error
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        error: error instanceof Error ? error.message : 'Token validation failed'
      };
    }
  }
}

export default ApiService;
