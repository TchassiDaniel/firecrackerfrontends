'use client';

import { Card } from "@/components/ui/card";
import { Cpu, CircuitBoard, HardDrive, Key } from "lucide-react";

export default function UsageStats() {
  const stats = [
    {
      name: 'CPU total',
      value: '0 vCPUs',
      icon: Cpu,
      description: 'Processeurs virtuels alloués'
    },
    {
      name: 'Mémoire totale',
      value: '0 MiB',
      icon: CircuitBoard,
      description: 'Mémoire RAM allouée'
    },
    {
      name: 'Stockage total',
      value: '0 GB',
      icon: HardDrive,
      description: 'Espace disque total'
    },
    {
      name: 'Clés SSH',
      value: '0',
      icon: Key,
      description: 'Clés SSH enregistrées'
    }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Statistiques d'Utilisation</h2>
      <div className="grid grid-cols-2 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="flex items-start space-x-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
