// lib/api/client.ts
import axios from 'axios';

// Types de services disponibles
export type ServiceType = 'AUTH_SERVICE' | 'USER_SERVICE' | 'VM_SERVICE' | 'NOTIFICATION_SERVICE';

interface ServiceConfig {
  baseURL: string;
  timeout: number;
}

// Détecter l'environnement de développement
const isDevelopment = process.env.NODE_ENV === 'development';

// Configuration des URLs des services
const serviceUrls = {
  AUTH_SERVICE: isDevelopment ? 'http://localhost:3002/api/auth' : process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
  USER_SERVICE: isDevelopment ? 'http://localhost:3002/api/users' : process.env.NEXT_PUBLIC_USER_SERVICE_URL,
  VM_SERVICE: isDevelopment ? 'http://localhost:3002/api/vms' : process.env.NEXT_PUBLIC_VM_SERVICE_URL,
  NOTIFICATION_SERVICE: isDevelopment ? 'http://localhost:3002/api/notifications' : process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL,
};

// Configuration des services
const SERVICE_CONFIG: Record<ServiceType, ServiceConfig> = {
  AUTH_SERVICE: {
    baseURL: serviceUrls.AUTH_SERVICE || '',
    timeout: 5000,
  },
  USER_SERVICE: {
    baseURL: serviceUrls.USER_SERVICE || '',
    timeout: 5000,
  },
  VM_SERVICE: {
    baseURL: serviceUrls.VM_SERVICE || '',
    timeout: 10000, // Timeout plus long pour les opérations VM
  },
  NOTIFICATION_SERVICE: {
    baseURL: serviceUrls.NOTIFICATION_SERVICE || '',
    timeout: 3000,
  },
};

// Créer une instance axios avec la configuration par défaut
const createClient = (serviceType: ServiceType) => {
  const config = SERVICE_CONFIG[serviceType];
  return axios.create({
    ...config,
    withCredentials: true, // Important pour les cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Map pour stocker les instances de client
const clientInstances: Map<ServiceType, ReturnType<typeof createClient>> = new Map();

// Fonction pour obtenir un client de service
export const getServiceClient = (serviceType: ServiceType) => {
  if (!clientInstances.has(serviceType)) {
    clientInstances.set(serviceType, createClient(serviceType));
  }
  return clientInstances.get(serviceType)!;
};