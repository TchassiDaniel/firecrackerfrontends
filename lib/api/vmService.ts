// lib/api/vmService.ts
import { getServiceClient } from './client';
import { API_ENDPOINTS } from '../apiEndpoints';
import {
  VirtualMachine,
  VMLog,
  CreateVMPayload,
  UpdateVMPayload
} from '../../types/virtualMachine';
import { SystemImage } from '@/types/virtualMachine';

// Service pour les machines virtuelles
class VMService {
  // Récupérer toutes les VMs avec filtres optionnels
  async getVMs(filters?: { status?: string; user?: string; search?: string }) {
    const client = getServiceClient('VM_SERVICE');
    const params = new URLSearchParams();
    
    if (filters?.status) {
      params.append('status', filters.status);
    }
    
    if (filters?.user) {
      params.append('user', filters.user);
    }
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    
    const url = `${API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.LIST}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await client.get(url);
    return response.data as VirtualMachine[];
  }
  
  // Récupérer une VM spécifique
  async getVM(id: string) {
    const client = getServiceClient('VM_SERVICE');
    const url = API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.GET(id);
    const response = await client.get(url);
    return response.data as VirtualMachine;
  }
  
  // Créer une nouvelle VM
  async createVM(vmData: CreateVMPayload) {
    const client = getServiceClient('VM_SERVICE');
    const url = API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.CREATE;
    const response = await client.post(url, vmData);
    return response.data as VirtualMachine;
  }
  
  // Mettre à jour une VM
  async updateVM(id: string, vmData: UpdateVMPayload) {
    const client = getServiceClient('VM_SERVICE');
    const url = API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.UPDATE(id);
    const response = await client.put(url, vmData);
    return response.data as VirtualMachine;
  }
  
  // Supprimer une VM
  async deleteVM(id: string) {
    const client = getServiceClient('VM_SERVICE');
    const url = API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.DELETE(id);
    const response = await client.delete(url);
    return response.data;
  }
  
  // lancer une vm
  async startVM(id: string) {
    const client = getServiceClient('VM_SERVICE');
    const url = API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.START(id);
    const response = await client.post(url);
    return response.data;
  }
  //arreter une vm 
  async stopVM(id: string) {
    const client = getServiceClient('VM_SERVICE');
    const url = API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.STOP(id);
    const response = await client.post(url);
    return response.data;
  }
  //mettre en pause une vm
  async pauseVM(id: string) {
    const client = getServiceClient('VM_SERVICE');
    const url = API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.PAUSE(id);
    const response = await client.post(url);
    return response.data;
  }
  
  // Récupérer les logs d'une VM
  async getVMLogs(id: string) {
    const client = getServiceClient('VM_SERVICE');
    const url = `${API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.GET(id)}/logs`;
    const response = await client.get(url);
    return response.data as VMLog[];
  }
  
  // Récupérer les images système disponibles
  async getSystemImages() {
    const client = getServiceClient('VM_SERVICE');
    const response = await client.get('/system-images');
    return response.data as SystemImage[];
  }
}

// Exporter une instance singleton
export const vmService = new VMService();