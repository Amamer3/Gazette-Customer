import type { GazetteService } from '../types/index';

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
      id: service.ID as any, // Cast to GazetteServiceType
      name: service.Nm,
      description: `Service for ${service.Nm.toLowerCase()}`,
      price: 0, // Will be fetched from a separate API call if needed
      processingTime: 'Processing time will be determined',
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
    
    return response;
  }

  static async submitApplication(applicationData: any): Promise<ApiResponse<any>> {
    const response = await this.makeRequest<any>('API/GPLoginweb/API_SubmitApplication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'APPType': 'WEB',
        'APITocken': this.API_TOKEN
      },
      body: JSON.stringify(applicationData)
    });
    
    return response;
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
