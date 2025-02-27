// Fichier app/admin/system-images/page.tsx 

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function SystemImagesPage() {
  const [images, setImages] = React.useState([
    {
      id: '1',
      name: 'Ubuntu 20.04',
      size: '2.1GB',
      status: 'Ready',
      lastUpdated: '2024-02-24',
    },
    // Ajoutez d'autres images si nécessaire
  ]);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>System Images</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search images..."
              className="max-w-sm"
            />
            <Button>Add New Image</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>{image.name}</TableCell>
                  <TableCell>{image.size}</TableCell>
                  <TableCell>{image.status}</TableCell>
                  <TableCell>{image.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
