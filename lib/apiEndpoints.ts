// lib/apiEndpoints.ts

import { id } from "date-fns/locale";

export const SERVICES = {
  AUTH_SERVICE: 'auth-service',
  USER_SERVICE: 'user-service',
  VM_SERVICE: 'vm-service',
  NOTIFICATION_SERVICE: 'notification-service',
  SYSTEM_IMAGES_SERVICE: 'system-images-service',
  ADMIN_SERVICE: 'admin-service'
} as const;

// Type pour les services
export type ServiceType = keyof typeof SERVICES;

export const API_ENDPOINTS = {
  AUTH: {
    service: SERVICES.AUTH_SERVICE,
    endpoints: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/signup",
      LOGOUT: "/auth/logout",
      ME: "/auth/me",
    },
  },
  USERS: {
    service: SERVICES.USER_SERVICE,
    endpoints: {
      LIST: "/users",
      CREATE: "/users",
      GET: (id: number) => `/users/${id}`,
      UPDATE: (id: number) => `/users/${id}`,
      DELETE: (id: number) => `/users/${id}`,
    },
  },
  VIRTUAL_MACHINES: {
    service: SERVICES.VM_SERVICE,
    endpoints: {
      LIST: (id: number) => `/users/${id}/vms`,
      LIST_BY_USER: (userId: number) => `/users/${userId}/vms`,
      CREATE: "/vms",
      GET: (id: number) => `/vms/${id.toString()}`,
      UPDATE: (id: number) => `/vms/${id.toString()}`,
      DELETE: (id: number) => `/vms/${id.toString()}`,
      START: (id: number) => `/vms/${id.toString()}/start`,
      STOP: (id: number) => `/vms/${id.toString()}/stop`,
      PAUSE: (id: number) => `/vms/${id.toString()}/pause`,
      AVAILABLE_LOCATIONS: "/ips/available_locations",
    },
  },

  NOTIFICATIONS: {
    service: SERVICES.NOTIFICATION_SERVICE,
    endpoints: {
      WS_CONNECT: "/notifications/ws",
      GET_ALL: "/notifications",
      MARK_READ: (id: number) => `/notifications/${id.toString()}/read`,
    },
  },
  SYSTEM_IMAGES: {
    service: SERVICES.SYSTEM_IMAGES_SERVICE,
    endpoints: {
      LIST: "/system-images",
      GET: (id: number) => `/system-images/${id.toString()}`,
      CREATE: "/system-images",
      UPDATE: (id: number) => `/system-images/${id.toString()}`,
      DELETE: (id: number) => `/system-images/${id.toString()}`,
    },
  },

  VM_MODELS: {
    service: SERVICES.VM_SERVICE,
    endpoints: {
      LIST: "/vm_models",
      GET: (id: number) => `/vm_models/${id.toString()}`,
      CREATE: "/vm_models",
      UPDATE: (id: number) => `/vm_models/${id.toString()}`,
      DELETE: (id: number) => `/vm_models/${id.toString()}`,
    },
  },
  
  ADMIN: {
    service: SERVICES.ADMIN_SERVICE,
    endpoints: {
      STATS: '/admin/stats',
      USAGE_STATS: '/admin/usage-stats',
      RECENT_USERS: '/admin/recent-users',
      RECENT_VMS: '/admin/recent-vms',
      DASHBOARD: '/admin/dashboard'
    }
  }
} as const;
