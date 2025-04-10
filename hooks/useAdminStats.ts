// hooks/useAdminStats.ts
import { useState, useCallback, useEffect } from 'react';
import { getServiceClient } from '@/lib/api/client';
import { API_ENDPOINTS, ServiceType } from '@/lib/apiEndpoints';
import { AdminStats, AdminUsageStats, AdminRecentUser, AdminRecentVM, AdminStatsResponse } from '@/types/admin';

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    total_vms: 0,
    total_offers: 0,
    total_images: 0
  });

  const [usageStats, setUsageStats] = useState<AdminUsageStats>({
    total_cpu: 0,
    total_memory: 0,
    total_disk: 0,
    total_ssh_keys: 0
  });

  const [recentUsers, setRecentUsers] = useState<AdminRecentUser[]>([]);
  const [recentVMs, setRecentVMs] = useState<AdminRecentVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminClient = getServiceClient('admin-service' as ServiceType);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Récupérer toutes les stats en une seule requête
      const response = await adminClient.get(API_ENDPOINTS.ADMIN.endpoints.STATS);
      const data = response.data as AdminStatsResponse;
      
      setStats(data.stats);
      setUsageStats(data.usageStats);
      setRecentUsers(data.recentUsers);
      setRecentVMs(data.recentVMs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques';
      setError(errorMessage);
      console.error('Erreur lors du chargement des statistiques:', err);
    } finally {
      setIsLoading(false);
    }
  }, [adminClient]);

  // Rafraîchir les stats toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Charger les stats au montage
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    usageStats,
    recentUsers,
    recentVMs,
    isLoading,
    error,
    refresh: fetchStats
  };
};