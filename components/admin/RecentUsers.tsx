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
import { Badge } from "@/components/ui/badge";

const recentUsers = [
  {
    id: 1,
    name: 'Junior',
    email: 'testingopstack@gmail.com',
    role: 'user',
    date: '24/02/2025'
  },
  {
    id: 2,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    date: '20/02/2025'
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    date: '20/02/2025'
  }
];

export default function RecentUsers() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Utilisateurs Récents</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === 'admin' ? 'destructive' : 'default'}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
