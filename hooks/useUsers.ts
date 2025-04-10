// hooks/useUsers.ts
import { useState, useCallback } from 'react';
import { getServiceClient } from '@/lib/api/client';
import { API_ENDPOINTS, SERVICES } from '@/lib/apiEndpoints';
import { User } from '@/types/user';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the client for the user service
  const userClient = getServiceClient("USER_SERVICE");

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userClient.get<User[]>(API_ENDPOINTS.USERS.endpoints.LIST);
      setUsers(response.data);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs');
      console.error('Erreur détaillée:', err);
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
        console.error('Headers:', err.response.headers);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUser = useCallback(async (id: number): Promise<User> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userClient.get<User>(API_ENDPOINTS.USERS.endpoints.GET(id));
      return response.data;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'utilisateur');
      console.error('Erreur détaillée:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userClient.post<User>(API_ENDPOINTS.USERS.endpoints.CREATE, data);
      setUsers(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'utilisateur');
      console.error('Erreur détaillée:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: number, data: Partial<User>): Promise<User> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userClient.put<User>(API_ENDPOINTS.USERS.endpoints.UPDATE(id), data);
      setUsers(prev => prev.map(user => Number(user.id) === id ? response.data : user));
      return response.data;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'utilisateur');
      console.error('Erreur détaillée:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await userClient.delete(API_ENDPOINTS.USERS.endpoints.DELETE(id));
      setUsers(prev => prev.filter(user => Number(user.id) !== id));
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'utilisateur');
      console.error('Erreur détaillée:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

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