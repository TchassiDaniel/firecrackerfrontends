// hooks/useUsers.ts
import { useState, useCallback } from 'react';
import { getServiceClient } from '@/lib/api/client';
import { API_ENDPOINTS, SERVICES } from '@/lib/apiEndpoints';
import { User } from '@/types/user';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtenir le client pour le service utilisateur
  const userClient = getServiceClient('USER_SERVICE');

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userClient.get(API_ENDPOINTS.USERS.endpoints.LIST);
      setUsers(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUser = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await userClient.get(API_ENDPOINTS.USERS.endpoints.GET(id));
      return response.data;
    } catch (err) {
      setError('Erreur lors du chargement de l\'utilisateur');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (data: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      setIsLoading(true);
      const response = await userClient.post(API_ENDPOINTS.USERS.endpoints.CREATE, data);
      setUsers(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Erreur lors de la création de l\'utilisateur');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      setIsLoading(true);
      const response = await userClient.put(API_ENDPOINTS.USERS.endpoints.UPDATE(id), data);
      setUsers(prev => prev.map(user => user.id === id ? response.data : user));
      return response.data;
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'utilisateur');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setIsLoading(true);
      await userClient.delete(API_ENDPOINTS.USERS.endpoints.DELETE(id));
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  };
};