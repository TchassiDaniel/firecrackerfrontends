import { useState, useEffect } from 'react';
import { getServiceClient } from '@/lib/api/client';

interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'creating';
  vcpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  metrics?: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
  };
}

interface VMFilters {
  status?: string;
  userId?: string;
  search?: string;
  page?: number;
}

export const useAdminVMs = () => {
  const [virtualMachines, setVirtualMachines] = useState<VirtualMachine[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState<VMFilters>({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const vmClient = getServiceClient('VM_SERVICE');
  const userClient = getServiceClient('USER_SERVICE');

  const fetchUsers = async () => {
    try {
      const response = await userClient.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchVMs = async (filters: VMFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.userId) queryParams.append('user', filters.userId);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page.toString());

      const response = await vmClient.get<VirtualMachine[]>(`/api/admin/vms?${queryParams}`);
      
      setVirtualMachines(response.data);
      // Pour le mock, on simule la pagination
      const total = response.data.length;
      setPagination({
        currentPage: filters.page || 1,
        lastPage: Math.ceil(total / 10),
        perPage: 10,
        total
      });
    } catch (err) {
      setError('Erreur lors du chargement des machines virtuelles');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVMStatus = async (vmId: string, action: 'start' | 'stop' | 'restart') => {
    try {
      await vmClient.post(`/api/admin/vms/${vmId}/${action}`);
      await fetchVMs(filters); // Rafraîchir la liste
    } catch (err) {
      console.error(`Error ${action} VM:`, err);
      throw err;
    }
  };

  const deleteVM = async (vmId: string) => {
    try {
      await vmClient.delete(`/api/admin/vms/${vmId}`);
      await fetchVMs(filters); // Rafraîchir la liste
    } catch (err) {
      console.error('Error deleting VM:', err);
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
