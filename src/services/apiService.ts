import type { GazetteService } from '../types/application';
import { API_CONFIG } from '../config/apiConfig';

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
  private static readonly API_TOKEN = API_CONFIG.TOKEN;
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second
  
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      console.log('Making API request to:', url);
      console.log('Using API token:', this.API_TOKEN);
      
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
        // Check if it's a database connection error that might be temporary
        if (data.ExceptionMessage && data.ExceptionMessage.includes('connection')) {
          throw new Error(`Database connection error: ${data.ExceptionMessage}`);
        }
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
      
      // Check if this is a retryable error and we haven't exceeded max retries
      const isRetryableError = error instanceof Error && (
        error.message.includes('Database connection error') ||
        error.message.includes('connection') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('ERR_NAME_NOT_RESOLVED')
      );
      
      if (isRetryableError && retryCount < this.MAX_RETRIES) {
        console.log(`Retrying request (${retryCount + 1}/${this.MAX_RETRIES}) after ${this.RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)));
        return this.makeRequest<T>(endpoint, options, retryCount + 1);
      }
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
          errorMessage = 'API server not found. Please check your API_BASE_URL configuration.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check if the API server is running.';
        } else if (error.message.includes('Database connection error')) {
          errorMessage = 'Database connection issue on the server. Please try again later or contact support.';
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
    const response = await this.makeRequest<ServiceApiResponse>(API_CONFIG.ENDPOINTS.GET_SERVICES, {
      method: 'POST',
      headers: {
        [API_CONFIG.HEADERS.CONTENT_TYPE]: 'application/json',
        [API_CONFIG.HEADERS.APP_TYPE]: 'WEB',
        [API_CONFIG.HEADERS.API_TOKEN]: this.API_TOKEN
      },
      body: JSON.stringify({
        "ID": API_CONFIG.REQUEST_IDS.SERVICES
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
    const response = await this.makeRequest<GazetteTypeApiResponse>('API/GPLoginweb/API_GazetteList', {
      method: 'POST',
      headers: {
        [API_CONFIG.HEADERS.CONTENT_TYPE]: 'application/json',
        [API_CONFIG.HEADERS.APP_TYPE]: 'WEB',
        [API_CONFIG.HEADERS.API_TOKEN]: this.API_TOKEN
      },
      body: JSON.stringify({
        "GazetteType": gazetteType,
        "PaymentPlan": paymentPlan
      })
    });
    
    if (!response.success) {
      return {
        success: false,
        data: null as any,
        error: response.error || 'Failed to fetch gazette types'
      };
    }

    return response;
  }


  static async submitApplication(applicationData: any): Promise<ApiResponse<any>> {
    const response = await this.makeRequest<any>('API/GPLoginweb/API_SubmitApplication', {
      method: 'POST',
      headers: {
        [API_CONFIG.HEADERS.CONTENT_TYPE]: 'application/json',
        [API_CONFIG.HEADERS.APP_TYPE]: 'WEB',
        [API_CONFIG.HEADERS.API_TOKEN]: this.API_TOKEN
      },
      body: JSON.stringify(applicationData)
    });
    
    if (!response.success) {
      return {
        success: false,
        data: null,
        error: response.error || 'Failed to submit application'
      };
    }

    return response;
  }


  static async validateToken(): Promise<ApiResponse<boolean>> {
    try {
      const response = await this.makeRequest<any>('API/GPLoginweb/API_ValidateToken', {
        method: 'POST',
        headers: {
          [API_CONFIG.HEADERS.CONTENT_TYPE]: 'application/json',
          [API_CONFIG.HEADERS.APP_TYPE]: 'WEB',
          [API_CONFIG.HEADERS.API_TOKEN]: this.API_TOKEN
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
