// hooks/useVirtualMachines.ts
import { useState, useCallback } from 'react';
import { getServiceClient } from '@/lib/api/client';
import { API_ENDPOINTS, SERVICES } from '@/lib/apiEndpoints';
import { VirtualMachine } from '@/types/virtualMachine';

type VirtualMachineAction = 'START' | 'STOP' | 'PAUSE';

export const useVirtualMachines = () => {
  const [virtualMachines, setVirtualMachines] = useState<VirtualMachine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtenir le client pour le service VM
  const vmClient = getServiceClient('VM_SERVICE');

  const fetchVirtualMachines = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vmClient.get(API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.LIST);
      setVirtualMachines(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des machines virtuelles');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVirtualMachine = async (data: Omit<VirtualMachine, 'id' | 'createdAt' | 'lastUpdated'>) => {
    try {
      setIsLoading(true);
      const response = await vmClient.post(API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.CREATE, data);
      setVirtualMachines(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Erreur lors de la création de la machine virtuelle');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateVirtualMachineStatus = async (id: string, action: 'start' | 'stop' | 'pause') => {
    try {
      setIsLoading(true);
      const actionEndpoint = {
        'start': API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.START,
        'stop': API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.STOP,
        'pause': API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.PAUSE
      }[action];

      if (!actionEndpoint) {
        throw new Error('Action non valide');
      }

      const response = await vmClient.post(actionEndpoint(id));
      setVirtualMachines(prev => 
        prev.map(vm => vm.id === id ? response.data : vm)
      );
      return response.data;
    } catch (err) {
      setError(`Erreur lors de l'action ${action} sur la machine virtuelle`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVirtualMachine = async (id: string) => {
    try {
      setIsLoading(true);
      await vmClient.delete(API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.DELETE(id));
      setVirtualMachines(prev => prev.filter(vm => vm.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de la machine virtuelle');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    virtualMachines,
    isLoading,
    error,
    fetchVirtualMachines,
    createVirtualMachine,
    updateVirtualMachineStatus,
    deleteVirtualMachine
  };
};