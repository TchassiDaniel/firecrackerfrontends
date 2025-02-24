// lib/apiEndpoints.ts

export const SERVICES = {
  AUTH_SERVICE: 'auth-service',
  USER_SERVICE: 'user-service',
  VM_SERVICE: 'vm-service',
  NOTIFICATION_SERVICE: 'notification-service'
} as const;

// Type pour les services
export type ServiceType = keyof typeof SERVICES;

export const API_ENDPOINTS = {
  AUTH: {
    service: SERVICES.AUTH_SERVICE,
    endpoints: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
    }
  },
  USERS: {
    service: SERVICES.USER_SERVICE,
    endpoints: {
      LIST: '/users',
      CREATE: '/users',
      GET: (id: string) => `/users/${id}`,
      UPDATE: (id: string) => `/users/${id}`,
      DELETE: (id: string) => `/users/${id}`,
    }
  },
  VIRTUAL_MACHINES: {
    service: SERVICES.VM_SERVICE,
    endpoints: {
      LIST: '/virtual-machines',
      CREATE: '/virtual-machines',
      GET: (id: string) => `/virtual-machines/${id}`,
      UPDATE: (id: string) => `/virtual-machines/${id}`,
      DELETE: (id: string) => `/virtual-machines/${id}`,
      START: (id: string) => `/virtual-machines/${id}/start`,
      STOP: (id: string) => `/virtual-machines/${id}/stop`,
      PAUSE: (id: string) => `/virtual-machines/${id}/pause`,
    }
  },
  NOTIFICATIONS: {
    service: SERVICES.NOTIFICATION_SERVICE,
    endpoints: {
      WS_CONNECT: '/notifications/ws',
      GET_ALL: '/notifications',
      MARK_READ: (id: string) => `/notifications/${id}/read`
    }
  }
} as const;