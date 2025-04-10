// types/admin.ts
export interface AdminStats {
  total_users: number;
  total_vms: number;
  total_offers: number;
  total_images: number;
}

export interface AdminUsageStats {
  total_cpu: number;
  total_memory: number;
  total_disk: number;
  total_ssh_keys: number;
}

export interface AdminRecentUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface AdminRecentVM {
  id: string;
  name: string;
  status: string;
  created_at: string;
  owner: {
    name: string;
  };
}

export interface AdminStatsResponse {
  stats: AdminStats;
  usageStats: AdminUsageStats;
  recentUsers: AdminRecentUser[];
  recentVMs: AdminRecentVM[];
}