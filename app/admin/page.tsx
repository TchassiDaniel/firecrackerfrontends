'use client';

import { Card } from "@/components/ui/card";
import { Users, Server, HardDrive, Database } from "lucide-react";
import UsageStats from "@/components/admin/UsageStats";
import VMStatus from "@/components/admin/VMStatus";
import RecentUsers from "@/components/admin/RecentUsers";
import RecentActivity from "@/components/admin/RecentActivity";

export default function AdminDashboard() {
  // Ces données devraient venir de votre API
  const stats = [
    { name: 'Utilisateurs', value: '3', icon: Users, color: 'bg-blue-500' },
    { name: 'Machines Virtuelles', value: '0', icon: Server, color: 'bg-green-500' },
    { name: 'Offres VM', value: '4', icon: Database, color: 'bg-purple-500' },
    { name: 'Images Système', value: '2', icon: HardDrive, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Tableau de bord Administrateur</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Usage Stats and VM Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UsageStats />
        <VMStatus />
      </div>

      {/* Recent Activity and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentUsers />
        <RecentActivity />
      </div>
    </div>
  );
}
