// types/virtualMachine.ts
export interface VirtualMachine {
    id: string;
    name: string;
    status: 'running' | 'stopped' | 'paused';
    specs: {
      cpu: number;
      memory: number;
      storage: number;
    };
    createdAt: string;
    lastUpdated: string;
    userId: string; // ID de l'utilisateur propriétaire
  }
  
  