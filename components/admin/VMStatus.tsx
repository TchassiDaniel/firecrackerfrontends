'use client';

import { Card } from "@/components/ui/card";
import { Play, Square, AlertTriangle, Loader2 } from "lucide-react";
import { VMStatusProps } from '@/types/adminComponents';

export default function VMStatus({ recentVMs }: VMStatusProps) {
  const getStatusCount = (status: string) => {
    return recentVMs.filter(vm => vm.status === status).length;
  };

  const statuses = [
    {
      name: 'En cours',
      value: getStatusCount('running'),
      icon: Play,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Arrêtées',
      value: getStatusCount('stopped'),
      icon: Square,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      name: 'En erreur',
      value: getStatusCount('error'),
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'En création',
      value: getStatusCount('creating'),
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">État des Machines Virtuelles</h2>
      <div className="grid grid-cols-2 gap-6">
        {statuses.map((status) => {
          const Icon = status.icon;
          return (
            <div key={status.name} className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${status.bgColor}`}>
                <Icon className={`h-5 w-5 ${status.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{status.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{status.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
