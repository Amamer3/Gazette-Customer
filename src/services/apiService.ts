import type { GazetteService } from '../types/application';

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
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
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
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async getServices(): Promise<ApiResponse<GazetteService[]>> {
    const response = await this.makeRequest<ServiceApiResponse>('API/GPLoginweb/API_GetParamDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'APPType': 'WEB',
        'APITocken': 'AyTRfghyNoo987-ghtuHH86YYR'
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
      id: service.ID,
      name: service.Nm,
      description: `Service for ${service.Nm.toLowerCase()}`,
      price: 0, // Will be fetched from a separate API call if needed
      processingTime: 'Processing time will be determined',
      category: 'General Services',
      requiredDocuments: [], // Will be fetched from a separate API call if needed
      icon: 'FileText', // Default icon
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
        'APITocken': 'AyTRfghyNoo987-ghtuHH86YYR'
      },
      body: JSON.stringify({
        "GazetteType": gazetteType,
        "PaymentPlan": paymentPlan
      })
    });
    
    return response;
  }
}

export default ApiService;
