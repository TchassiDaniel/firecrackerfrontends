'use client';

import { Card } from "@/components/ui/card";
import { Cpu, CircuitBoard, HardDrive, Key } from "lucide-react";
import { UsageStatsProps } from '@/types/adminComponents';

export default function UsageStats({ usageStats }: UsageStatsProps) {
  const stats = [
    {
      name: 'CPU total',
      value: `${usageStats.total_cpu} vCPUs`,
      icon: Cpu,
      description: 'Processeurs virtuels alloués'
    },
    {
      name: 'Mémoire totale',
      value: `${usageStats.total_memory} MiB`,
      icon: CircuitBoard,
      description: 'Mémoire RAM allouée'
    },
    {
      name: 'Stockage total',
      value: `${usageStats.total_disk} GB`,
      icon: HardDrive,
      description: 'Espace de stockage total'
    },
    {
      name: 'Clés SSH',
      value: `${usageStats.total_ssh_keys} clés`,
      icon: Key,
      description: 'Clés SSH configurées'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.description}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.name}</p>
            </div>
            <stat.icon className="h-6 w-6 text-gray-400" />
          </div>
        </Card>
      ))}
    </div>
  );
}
