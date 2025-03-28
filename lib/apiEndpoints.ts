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
      LIST: '/vms',  // Récupérer toutes les VMs (admin)
      LIST_BY_USER: (userId: string) => `/users/${userId}/vms`,  // Récupérer les VMs d'un utilisateur spécifique
      CREATE: '/vms',  
      GET: (id: string) => `/vms/${id}`,
      UPDATE: (id: string) => `/vms/${id}`,
      DELETE: (id: string) => `/vms/${id}`,
      START: (id: string) => `/vms/${id}/start`,
      STOP: (id: string) => `/vms/${id}/stop`,
      PAUSE: (id: string) => `/vms/${id}/pause`,
    }
  },
  
  NOTIFICATIONS: {
    service: SERVICES.NOTIFICATION_SERVICE,
    endpoints: {
      WS_CONNECT: '/notifications/ws',
      GET_ALL: '/notifications',
      MARK_READ: (id: string) => `/notifications/${id}/read`
    }
  },
  SYSTEM_IMAGES: {
    service: SERVICES.VM_SERVICE,
    endpoints: {
      LIST: '/system-images',
      GET: (id: string) => `/system-images/${id}`,
      CREATE: '/system-images',
      UPDATE: (id: string) => `/system-images/${id}`,
      DELETE: (id: string) => `/system-images/${id}`,
    }
  },

  VM_OFFERS: {
    service: SERVICES.VM_SERVICE,
    endpoints: {
      LIST: '/vm-offers',
      GET: (id: string) => `/vm-offers/${id}`,
      CREATE: '/vm-offers',
      UPDATE: (id: string) => `/vm-offers/${id}`,
      DELETE: (id: string) => `/vm-offers/${id}`,
    }
  },
} as const;