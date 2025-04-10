'use client';

import { Card } from "@/components/ui/card";
import { Users, Server, HardDrive, Database } from "lucide-react";
import UsageStats from "@/components/admin/UsageStats";
import VMStatus from "@/components/admin/VMStatus";
import RecentUsers from "@/components/admin/RecentUsers";
import RecentActivity from "@/components/admin/RecentActivity";
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAdminVMs } from '@/hooks/useAdminVMs';
import { useUsers } from '@/hooks/useUsers';

export default function AdminDashboard() {
  const { stats, usageStats, recentVMs, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { virtualMachines, isLoading: vmsLoading, error: vmsError } = useAdminVMs();
  const { users, isLoading: usersLoading, error: usersError } = useUsers();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Tableau de bord Administrateur</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
            </div>
            <Users className="h-6 w-6 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Machines Virtuelles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_vms}</p>
            </div>
            <Server className="h-6 w-6 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Offres VM</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_offers}</p>
            </div>
            <Database className="h-6 w-6 text-purple-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Images Système</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_images}</p>
            </div>
            <HardDrive className="h-6 w-6 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Usage Stats */}
      {statsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : statsError ? (
        <div className="text-red-500 text-center py-8">
          {statsError}
        </div>
      ) : (
        <UsageStats usageStats={usageStats} />
      )}

      {/* VM Status */}
      {vmsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : vmsError ? (
        <div className="text-red-500 text-center py-8">
          {vmsError}
        </div>
      ) : (
        <VMStatus recentVMs={virtualMachines} />
      )}

      {/* Recent Users */}
      {usersLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : usersError ? (
        <div className="text-red-500 text-center py-8">
          {usersError}
        </div>
      ) : (
        <RecentUsers recentUsers={users} />
      )}

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
