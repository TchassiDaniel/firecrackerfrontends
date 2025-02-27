'use client';

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RecentActivity() {
  // Ces données devraient venir de votre API
  const activities = [
    {
      id: 1,
      action: 'Création VM',
      vm: 'vm-test-1',
      user: 'junior@example.com',
      date: '24/02/2025'
    },
    {
      id: 2,
      action: 'Arrêt VM',
      vm: 'vm-prod-1',
      user: 'admin@example.com',
      date: '23/02/2025'
    },
    {
      id: 3,
      action: 'Démarrage VM',
      vm: 'vm-dev-1',
      user: 'test@example.com',
      date: '22/02/2025'
    }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Activité Récente</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>VM</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.action}</TableCell>
                <TableCell>{activity.vm}</TableCell>
                <TableCell>{activity.user}</TableCell>
                <TableCell>{activity.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
