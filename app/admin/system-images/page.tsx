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
import { Badge } from '@/components/ui/badge';
import { 
  ServerIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function SystemImagesPage() {
  const [images, setImages] = React.useState([
    {
      id: '1',
      name: 'Ubuntu 20.04 LTS',
      description: 'Latest Long Term Support release',
      size: '2.1GB',
      status: 'Ready',
      lastUpdated: '2024-02-24',
    },
    {
      id: '2',
      name: 'Debian 11',
      description: 'Stable release with minimal installation',
      size: '1.8GB',
      status: 'Updating',
      lastUpdated: '2024-02-23',
    },
    {
      id: '3',
      name: 'CentOS 8',
      description: 'Enterprise-grade Linux distribution',
      size: '2.4GB',
      status: 'Ready',
      lastUpdated: '2024-02-22',
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready':
        return <Badge className="bg-green-500">Ready</Badge>;
      case 'updating':
        return <Badge className="bg-blue-500">Updating</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Error</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Images</h1>
        <p className="text-gray-500 mt-2">
          Manage and configure system images for virtual machines
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <ServerIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Images</p>
                <p className="text-2xl font-bold">{images.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <ServerIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
                <p className="text-2xl font-bold">
                  {images.filter(img => img.status.toLowerCase() === 'ready').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <ArrowPathIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Updating</p>
                <p className="text-2xl font-bold">
                  {images.filter(img => img.status.toLowerCase() === 'updating').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative flex-1 md:max-w-sm">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search images..."
                  className="pl-9"
                />
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Image
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Image Details</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image) => (
                <TableRow key={image.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{image.name}</p>
                      <p className="text-sm text-gray-500">{image.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{image.size}</TableCell>
                  <TableCell>{getStatusBadge(image.status)}</TableCell>
                  <TableCell>{image.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="h-8">
                        <PencilSquareIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
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
