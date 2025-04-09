// lib/api/client.ts
import axios from 'axios';

export type ServiceType = 'AUTH_SERVICE' | 'USER_SERVICE' | 'VM_SERVICE' | 'NOTIFICATION_SERVICE' | 'SYSTEM_IMAGES_SERVICE';

interface ServiceConfig {
  baseURL: string;
  timeout: number;
}

const isDevelopment = process.env.NODE_ENV === 'development';

const serviceUrls = {
  // For AUTH_SERVICE, we'll use our local proxy in development to avoid CORS issues
  AUTH_SERVICE: isDevelopment ? '/api' : (process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || ''),
  //AUTH_SERVICE: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || '',
  USER_SERVICE: process.env.NEXT_PUBLIC_USER_SERVICE_URL || '',
  VM_SERVICE: process.env.NEXT_PUBLIC_VM_SERVICE_URL || '',
  NOTIFICATION_SERVICE: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || '',
  SYSTEM_IMAGES_SERVICE: process.env.NEXT_PUBLIC_SYSTEM_IMAGES_SERVICE_URL || '',
};

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
    timeout: 10000,
  },
  NOTIFICATION_SERVICE: {
    baseURL: serviceUrls.NOTIFICATION_SERVICE || '',
    timeout: 5000,
  },
  SYSTEM_IMAGES_SERVICE: {
    baseURL: serviceUrls.SYSTEM_IMAGES_SERVICE || '',
    timeout: 5000,
  },
};

const createClient = (serviceType: ServiceType) => {
  const config = SERVICE_CONFIG[serviceType];
  return axios.create({
    ...config,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const clientInstances: Map<ServiceType, ReturnType<typeof createClient>> = new Map();

export const getServiceClient = (serviceType: ServiceType) => {
  if (!clientInstances.has(serviceType)) {
    clientInstances.set(serviceType, createClient(serviceType));
  }
  return clientInstances.get(serviceType)!;
};