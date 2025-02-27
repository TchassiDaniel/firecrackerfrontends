import { useState, useEffect } from 'react';
import { getServiceClient } from '@/lib/api/client';

interface UsageStats {
  total_cpu: number;
  total_memory: number;
  total_disk: number;
  total_ssh_keys: number;
}

interface Stats {
  total_users: number;
  total_vms: number;
  total_offers: number;
  total_images: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface RecentVM {
  id: string;
  name: string;
  status: string;
  created_at: string;
  owner: {
    name: string;
  };
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    total_vms: 0,
    total_offers: 0,
    total_images: 0
  });

  const [usageStats, setUsageStats] = useState<UsageStats>({
    total_cpu: 0,
    total_memory: 0,
    total_disk: 0,
    total_ssh_keys: 0
  });

  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentVMs, setRecentVMs] = useState<RecentVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminClient = getServiceClient('USER_SERVICE');

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsResponse, usageResponse, usersResponse, vmsResponse] = await Promise.all([
        adminClient.get('/admin/stats'),
        adminClient.get('/admin/usage-stats'),
        adminClient.get('/admin/recent-users'),
        adminClient.get('/admin/recent-vms')
      ]);

      setStats(statsResponse.data);
      setUsageStats(usageResponse.data);
      setRecentUsers(usersResponse.data);
      setRecentVMs(vmsResponse.data);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    usageStats,
    recentUsers,
    recentVMs,
    isLoading,
    error,
    refreshStats: fetchStats
  };
};
