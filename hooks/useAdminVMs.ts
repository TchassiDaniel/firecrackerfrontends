import { useState, useEffect } from 'react';
import { getServiceClient } from '@/lib/api/client';
import { API_ENDPOINTS,ServiceType } from '@/lib/apiEndpoints';
import { 
  AdminVirtualMachine, 
  AdminVMFilters, 
  AdminVMPagination,
  AdminVMResponse 
} from '@/types/adminVM';

/**
 * Hook pour la gestion des machines virtuelles administrateur
 */
export const useAdminVMs = () => {
  const [virtualMachines, setVirtualMachines] = useState<AdminVirtualMachine[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState<AdminVMFilters>({});
  const [pagination, setPagination] = useState<AdminVMPagination>({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const vmClient = getServiceClient('vm-service' as ServiceType);
  const userClient = getServiceClient('user-service' as ServiceType);

  const fetchUsers = async () => {
    try {
      const response = await userClient.get(API_ENDPOINTS.USERS.endpoints.LIST);
      setUsers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs');
      console.error('Erreur lors du chargement des utilisateurs:', err);
    }
  };

  const fetchVMs = async (filters: AdminVMFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.userId) queryParams.append('user', filters.userId);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page.toString());

      const response = await vmClient.get<AdminVMResponse>(API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.LIST);
      
      setVirtualMachines(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des machines virtuelles');
      console.error('Erreur lors du chargement des machines virtuelles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVMStatus = async (vmId: string, action: 'start' | 'stop' | 'restart') => {
    try {
      const id = parseInt(vmId);
      if (isNaN(id)) throw new Error('ID invalide');
      
      const endpoint = {
        start: 'START',
        stop: 'STOP',
        restart: 'STOP' // Pour restart, on arrête d'abord
      }[action];
      
      const endpointKey = endpoint as keyof typeof API_ENDPOINTS.VIRTUAL_MACHINES.endpoints;
      const endpointValue = API_ENDPOINTS.VIRTUAL_MACHINES.endpoints[endpointKey];
      
      // Vérifier si l'endpoint est une fonction
      const endpointUrl = typeof endpointValue === 'function' ? endpointValue(id) : endpointValue;
      
      await vmClient.post(endpointUrl);
      await fetchVMs(filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut');
      console.error('Erreur lors de la mise à jour du statut:', err);
      throw err;
    }
  };

  const deleteVM = async (vmId: string) => {
    try {
      const id = parseInt(vmId);
      if (isNaN(id)) throw new Error('ID invalide');
      
      await vmClient.delete(API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.DELETE(id));
      await fetchVMs(filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      console.error('Erreur lors de la suppression:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchVMs(filters);
  }, [filters]);

  return {
    virtualMachines,
    users,
    isLoading,
    error,
    pagination,
    filters,
    setFilters,
    updateVMStatus,
    deleteVM,
    refreshVMs: () => fetchVMs(filters)
  };
};