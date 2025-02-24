// lib/api/client.ts
import axios, { AxiosInstance } from 'axios';
import { SERVICES, ServiceType } from '../apiEndpoints';

// Types pour la gestion des services
type ServiceName = keyof typeof SERVICES;

interface ServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Configuration des services
const SERVICE_CONFIG: Record<ServiceType, ServiceConfig> = {
  AUTH_SERVICE: {
    baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || '/api/auth',
    timeout: 5000,
  },
  USER_SERVICE: {
    baseURL: process.env.NEXT_PUBLIC_USER_SERVICE_URL || '/api/users',
    timeout: 5000,
  },
  VM_SERVICE: {
    baseURL: process.env.NEXT_PUBLIC_VM_SERVICE_URL || '/api/vms',
    timeout: 10000, // Timeout plus long pour les opérations VM
  },
  NOTIFICATION_SERVICE: {
    baseURL: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || '/api/notifications',
    timeout: 3000,
  },
};

// Classe pour gérer les clients API
class ApiClientManager {
  private clients: Map<ServiceType, AxiosInstance> = new Map();
  private readonly apiGatewayUrl: string;

  constructor() {
    this.apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || '';
    this.initializeClients();
  }

  private initializeClients() {
    (Object.keys(SERVICES) as ServiceType[]).forEach((serviceName) => {
      const config = SERVICE_CONFIG[serviceName];
      const client = axios.create({
        baseURL: `${this.apiGatewayUrl}${config.baseURL}`,
        timeout: config.timeout,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
      });

      // Ajout des intercepteurs pour chaque client
      this.setupInterceptors(client, serviceName);
      this.clients.set(serviceName, client);
    });
  }

  private setupInterceptors(client: AxiosInstance, serviceName: ServiceType) {
    // Intercepteur de requête
    client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Ajout d'un header pour identifier le service
      config.headers['X-Service-Name'] = SERVICES[serviceName];
      
      return config;
    });

    // Intercepteur de réponse
    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Gestion des erreurs spécifiques aux services
        if (error.response?.status === 401) {
          if (serviceName === 'AUTH_SERVICE') {
            // Redirection vers la page de login si l'erreur vient du service d'auth
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
          } else {
            // Tentative de refresh du token pour les autres services
            try {
              const authClient = this.getClient('AUTH_SERVICE');
              const response = await authClient.post('/auth/refresh-token');
              localStorage.setItem('token', response.data.token);
              
              // Réessayer la requête originale
              const originalRequest = error.config;
              return client(originalRequest);
            } catch (refreshError) {
              localStorage.removeItem('token');
              window.location.href = '/auth/login';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public getClient(serviceName: ServiceType): AxiosInstance {
    const client = this.clients.get(serviceName);
    if (!client) {
      throw new Error(`Client not found for service: ${serviceName}`);
    }
    return client;
  }
}

// Création d'une instance unique du gestionnaire
export const apiClientManager = new ApiClientManager();

// Export d'une fonction helper pour obtenir facilement un client
export const getServiceClient = (serviceName: ServiceType): AxiosInstance => {
  return apiClientManager.getClient(serviceName);
};