'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Stats {
  total_users: number;
  total_vms: number;
  total_offers: number;
  total_images: number;
}

interface UsageStats {
  total_cpu: number;
  total_memory: number;
  total_disk: number;
  total_ssh_keys: number;
}

interface VmStatus {
  running: number;
  stopped: number;
  error: number;
  creating: number;
}

interface User {
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Activity {
  status: string;
  virtualMachine: {
    name: string;
  };
  user: {
    name: string;
  };
  created_at: string;
}

export default function AdminDashboard() {
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

  const [vmsByStatus, setVmsByStatus] = useState<VmStatus>({
    running: 0,
    stopped: 0,
    error: 0,
    creating: 0
  });

  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        const data = await response.json();
        setStats(data.stats);
        setUsageStats(data.usageStats);
        setVmsByStatus(data.vmsByStatus);
        setRecentUsers(data.recentUsers);
        setRecentActivity(data.recentActivity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container-fluid p-4">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="bg-primary text-white">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h6 className="mb-0">Utilisateurs</h6>
                <h2 className="mb-0 mt-2">{stats.total_users}</h2>
              </div>
              <i className="text-4xl opacity-50">👥</i>
            </div>
            <Link href="/admin/users" className="absolute inset-0" />
          </div>
        </Card>

        <Card className="bg-success text-white">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h6 className="mb-0">Machines Virtuelles</h6>
                <h2 className="mb-0 mt-2">{stats.total_vms}</h2>
              </div>
              <i className="text-4xl opacity-50">💻</i>
            </div>
            <Link href="/admin/all-vms" className="absolute inset-0" />
          </div>
        </Card>

        <Card className="bg-info text-white">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h6 className="mb-0">Offres VM</h6>
                <h2 className="mb-0 mt-2">{stats.total_offers}</h2>
              </div>
              <i className="text-4xl opacity-50">📦</i>
            </div>
            <Link href="/admin/vm-offers" className="absolute inset-0" />
          </div>
        </Card>

        <Card className="bg-warning text-white">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h6 className="mb-0">Images Système</h6>
                <h2 className="mb-0 mt-2">{stats.total_images}</h2>
              </div>
              <i className="text-4xl opacity-50">💾</i>
            </div>
            <Link href="/admin/system-images" className="absolute inset-0" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Statistiques d'utilisation */}
        <Card>
          <div className="p-4">
            <h5 className="text-xl font-bold mb-4">Statistiques d'Utilisation</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded p-3">
                <h6 className="text-gray-500 mb-2">CPU Total</h6>
                <h4 className="text-xl font-bold">{usageStats.total_cpu} vCPUs</h4>
              </div>
              <div className="border rounded p-3">
                <h6 className="text-gray-500 mb-2">Mémoire Totale</h6>
                <h4 className="text-xl font-bold">{usageStats.total_memory} MiB</h4>
              </div>
              <div className="border rounded p-3">
                <h6 className="text-gray-500 mb-2">Stockage Total</h6>
                <h4 className="text-xl font-bold">{usageStats.total_disk} GB</h4>
              </div>
              <div className="border rounded p-3">
                <h6 className="text-gray-500 mb-2">Clés SSH</h6>
                <h4 className="text-xl font-bold">{usageStats.total_ssh_keys}</h4>
              </div>
            </div>
          </div>
        </Card>

        {/* État des VMs */}
        <Card>
          <div className="p-4">
            <h5 className="text-xl font-bold mb-4">État des Machines Virtuelles</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded p-3">
                <h6 className="text-gray-500 mb-2">En cours</h6>
                <h4 className="text-xl font-bold text-green-500">{vmsByStatus.running}</h4>
              </div>
              <div className="border rounded p-3">
                <h6 className="text-gray-500 mb-2">Arrêtées</h6>
                <h4 className="text-xl font-bold text-red-500">{vmsByStatus.stopped}</h4>
              </div>
              <div className="border rounded p-3">
                <h6 className="text-gray-500 mb-2">En erreur</h6>
                <h4 className="text-xl font-bold text-yellow-500">{vmsByStatus.error}</h4>
              </div>
              <div className="border rounded p-3">
                <h6 className="text-gray-500 mb-2">En création</h6>
                <h4 className="text-xl font-bold text-blue-500">{vmsByStatus.creating}</h4>
              </div>
            </div>
          </div>
        </Card>

        {/* Utilisateurs récents */}
        <Card>
          <div className="p-4">
            <h5 className="text-xl font-bold mb-4">Utilisateurs Récents</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Rôle</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Activité récente */}
        <Card>
          <div className="p-4">
            <h5 className="text-xl font-bold mb-4">Activité Récente</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Action</th>
                    <th className="px-4 py-2">VM</th>
                    <th className="px-4 py-2">Utilisateur</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <Badge 
                          variant={
                            activity.status === 'running' 
                              ? 'success' 
                              : activity.status === 'stopped' 
                                ? 'destructive' 
                                : 'default'
                          }
                        >
                          {activity.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">{activity.virtualMachine.name}</td>
                      <td className="px-4 py-2">{activity.user.name}</td>
                      <td className="px-4 py-2">{new Date(activity.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
