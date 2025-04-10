// hooks/useVirtualMachines.ts
import { useState, useCallback } from "react";
import { getServiceClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import {
  VirtualMachine,
  SystemImage,
  VMmodels,
  VMMetrics,
  VMStatusHistory,
  VmCreate,
} from "@/types/virtualMachine";

export const useVirtualMachines = () => {
  const [virtualMachines, setVirtualMachines] = useState<VirtualMachine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVM, setSelectedVM] = useState<VirtualMachine | null>(null);
  const [userVirtualMachines, setUserVirtualMachines] = useState<
    VirtualMachine[] | null
  >(null);
  const [systemImages, setSystemImages] = useState<SystemImage[]>([]);
  const [vmModels, setvmModels] = useState<VMmodels[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  //on initialise le client pour le service vm
  const vmClient = getServiceClient("VM_SERVICE");
  const systemImagesClient = getServiceClient("SYSTEM_IMAGES_SERVICE");
  //fonction asynchrone pour recuperer toutes les vms
  const fetchVirtualMachines = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vmClient.get(
        API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.LIST(id)
      );
      setVirtualMachines(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des machines virtuelles");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les machines virtuelles d'un utilisateur spécifique
  const fetchUserVirtualMachines = useCallback(async (userId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vmClient.get(
        API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.LIST_BY_USER(userId)
      );
      setUserVirtualMachines(response.data);
    } catch (err) {
      setError(
        "Erreur lors du chargement des machines virtuelles de l'utilisateur"
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVirtualMachineById = useCallback(
    async (id: number): Promise<VirtualMachine> => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await vmClient.get(
          API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.GET(id)
        );
        setSelectedVM(response.data);
        return response.data; // Ajout de cette ligne pour retourner la VM
      } catch (err) {
        setError("Erreur lors du chargement de la machine virtuelle");
        console.error(err);
        throw err; // Optionnel : relancer l'erreur pour que le composant puisse la gérer
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  //creer une vm
  const createVirtualMachine = useCallback(
    async (data: VmCreate) => {
      try {
        console.log(
          "URL de création:",
          API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.CREATE
        );
        console.log("Client VM configuré:", vmClient);
        console.log("Données envoyées au serveur:", data);

        const response = await vmClient.post(
          API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.CREATE,
          data
        );
        console.log("Réponse du serveur:", response.data);
        setVirtualMachines((prev) => [...prev, response.data]);
        return response.data;
      } catch (err: any) {
        console.error("Erreur détaillée:", err);
        console.error("Stack trace:", err.stack);
        if (err.response) {
          console.error("Status:", err.response.status);
          console.error("Data:", err.response.data);
          console.error("Headers:", err.response.headers);
          setError(
            `Erreur serveur: ${
              err.response.data.message || err.response.statusText
            }`
          );
        } else if (err.request) {
          console.error("Pas de réponse reçue:", err.request);
          setError("Pas de réponse du serveur");
        } else {
          console.error("Erreur de configuration:", err.message);
          setError(`Erreur: ${err.message}`);
        }
        throw err;
      }
    },
    [vmClient]
  );

  //mettre a jour l'etat d'une vm
  const updateVirtualMachineStatus = useCallback(
    async (vmId: number, action: "start" | "stop" | "pause") => {
      try {
        setIsLoading(true);
        setError(null);

        let endpoint;
        switch (action) {
          case "start":
            endpoint = API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.START;
            break;
          case "stop":
            endpoint = API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.STOP;
            break;
          case "pause":
            endpoint = API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.PAUSE;
            break;
        }

        const response = await vmClient.post(endpoint(vmId));

        // Mettre à jour la VM dans la liste
        setVirtualMachines((prevVMs) =>
          prevVMs.map((vm) =>
            vm.id === vmId ? { ...vm, status: response.data.status } : vm
          )
        );

        return response.data;
      } catch (err) {
        setError(
          `Erreur lors de la mise à jour du statut de la machine virtuelle`
        );
        console.error(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  //supprimer une vm
  const deleteVirtualMachine = async (id: number) => {
    try {
      setIsLoading(true);
      await vmClient.delete(
        API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.DELETE(id)
      );
      setVirtualMachines((prev) => prev.filter((vm) => vm.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression de la machine virtuelle");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Nouvelle méthode pour mettre à jour une machine virtuelle
  const updateVirtualMachine = useCallback(
    async (
      id: number,
      data: Partial<Omit<VirtualMachine, "id" | "createdAt" | "lastUpdated">>
    ) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await vmClient.put(
          API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.UPDATE(id),
          data
        );

        // Mettre à jour la liste des machines virtuelles
        setVirtualMachines((prev) =>
          prev.map((vm) => (vm.id === id ? { ...vm, ...response.data } : vm))
        );

        // Mettre à jour la VM sélectionnée si c'est la même
        if (selectedVM?.id === id) {
          setSelectedVM(response.data);
        }

        return response.data;
      } catch (err) {
        setError("Erreur lors de la mise à jour de la machine virtuelle");
        console.error(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Récupérer les images système
  const fetchSystemImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await systemImagesClient.get(
        API_ENDPOINTS.SYSTEM_IMAGES.endpoints.LIST
      );
      setSystemImages(response.data);
      return response.data;
    } catch (err) {
      setError("Erreur lors du chargement des images système");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les offres de machines virtuelles
  const fetchVMModels = useCallback(async () => {
    try {
      console.log("Récupération des modèles de VM...");
      setIsLoading(true);
      setError(null);
      const response = await vmClient.get(
        API_ENDPOINTS.VM_MODELS.endpoints.LIST
      );
      console.log("Modèles reçus:", response.data);
      setvmModels(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des modèles:", err);
      setError("Erreur lors du chargement des modèles de VM");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [vmClient]);

  // Récupérer les métriques d'une VM
  const fetchVMMetrics = useCallback(async (id: number): Promise<VMMetrics> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vmClient.get(
        `${API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.GET(id)}/metrics`
      );
      return response.data;
    } catch (err) {
      setError("Erreur lors du chargement des métriques");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer l'historique des statuts d'une VM
  const fetchVMStatusHistory = useCallback(
    async (id: number): Promise<VMStatusHistory[]> => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await vmClient.get(
          `${API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.GET(id)}/status-history`
        );
        return response.data;
      } catch (err) {
        setError("Erreur lors du chargement de l'historique des statuts");
        console.error(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Récupérer les locations
  const fetchLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vmClient.get(
        API_ENDPOINTS.VIRTUAL_MACHINES.endpoints.AVAILABLE_LOCATIONS
      );
      setLocations(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des locations");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [vmClient]);

  // Retourner toutes les méthodes et états
  return {
    virtualMachines,
    systemImages,
    vmModels,
    selectedVM,
    isLoading,
    error,
    locations,
    userVirtualMachines,
    fetchVirtualMachines,
    fetchSystemImages,
    fetchVMModels,
    fetchLocations,
    createVirtualMachine,
    deleteVirtualMachine,
    updateVirtualMachine,
    updateVirtualMachineStatus,
    fetchUserVirtualMachines,
    fetchVirtualMachineById,
    fetchVMMetrics,
    fetchVMStatusHistory,
  };
};
