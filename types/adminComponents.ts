// types/adminComponents.ts
import { AdminUsageStats, AdminRecentVM, AdminRecentUser } from './admin';

export interface UsageStatsProps {
  usageStats: AdminUsageStats;
}

export interface VMStatusProps {
  recentVMs: AdminRecentVM[];
}

export interface RecentUsersProps {
  recentUsers: AdminRecentUser[];
}