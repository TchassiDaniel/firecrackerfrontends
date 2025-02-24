// types/user.ts
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    createdAt: string;
    lastLogin: string;
    isActive: boolean;
    virtualMachines?: string[]; // IDs des machines virtuelles associées
  }