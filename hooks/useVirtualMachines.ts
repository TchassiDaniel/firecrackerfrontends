// hooks/useVirtualMachines.ts
import { useState, useCallback } from 'react';
import { getServiceClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';
import { VirtualMachine, SystemImage, VMOffer } from '@/types/virtualMachine';



export const useVirtualMachines = () => {

  const [virtualMachines, setVirtualMachines] = useState<VirtualMachine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVM, setSelectedVM] = useState<VirtualMachine | null>(null);
  const [userVirtualMachines, setUserVirtualMachines] = useState<VirtualMachine[] | null>(null);
  const [systemImages, setSystemImages] = useState<SystemImage[]>([]);
  const [vmOffers, setVMOffers] = useState<VMOffer[]>([]);

  //on initialise le client pour le service vm
  const vmClient = getServiceClient('VM_SERVICE');

  //fonction asynchrone pour recuperer toutes les vms
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

     // Récupérer les machines virtuelles d'un utilisateur spécifique
  const fetchUserVirtualMachines = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vmClient.get(API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.LIST_BY_USER(userId));
      setUserVirtualMachines(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des machines virtuelles de l\'utilisateur');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVirtualMachineById = useCallback(async (id: string): Promise<VirtualMachine> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vmClient.get(API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.GET(id));
      setSelectedVM(response.data);
      return response.data; // Ajout de cette ligne pour retourner la VM
    } catch (err) {
      setError('Erreur lors du chargement de la machine virtuelle');
      console.error(err);
      throw err; // Optionnel : relancer l'erreur pour que le composant puisse la gérer
    } finally {
      setIsLoading(false);
    }
  }, []);
  

 //creer une vm
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

  //mettre a jour l'etat d'une vm
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

  //supprimer une vm
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

  // Nouvelle méthode pour mettre à jour une machine virtuelle
  const updateVirtualMachine = useCallback(async (
    id: string, 
    data: Partial<Omit<VirtualMachine, 'id' | 'createdAt' | 'lastUpdated'>>
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vmClient.put(
        API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.UPDATE(id), 
        data
      );
      
      // Mettre à jour la liste des machines virtuelles
      setVirtualMachines(prev => 
        prev.map(vm => vm.id === id ? { ...vm, ...response.data } : vm)
      );

      // Mettre à jour la VM sélectionnée si c'est la même
      if (selectedVM?.id === id) {
        setSelectedVM(response.data);
      }

      return response.data;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la machine virtuelle');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les images système
  const fetchSystemImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vmClient.get(API_ENDPOINTS.SYSTEM_IMAGES.endpoints.LIST);
      setSystemImages(response.data);
      return response.data;
    } catch (err) {
      setError('Erreur lors du chargement des images système');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les offres de machines virtuelles
  const fetchVMOffers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vmClient.get(API_ENDPOINTS.VM_OFFERS.endpoints.LIST);
      setVMOffers(response.data);
      return response.data;
    } catch (err) {
      setError('Erreur lors du chargement des offres de machines virtuelles');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Retourner toutes les méthodes et états
  return {
    virtualMachines,
    userVirtualMachines,
    selectedVM,
    systemImages,
    vmOffers,
    isLoading,
    error,
    fetchVirtualMachines,
    fetchUserVirtualMachines,
    fetchVirtualMachineById,
    createVirtualMachine,
    updateVirtualMachineStatus,
    updateVirtualMachine,
    fetchSystemImages,
    fetchVMOffers,
  };
};
