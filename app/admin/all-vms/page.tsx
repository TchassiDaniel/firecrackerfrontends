'use client';

import React from 'react';
import { useAdminVMs } from '@/hooks/useAdminVMs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreVertical, Search, X } from 'lucide-react';
import Link from 'next/link';

export default function AllVirtualMachinesPage() {
  const {
    virtualMachines,
    users,
    isLoading,
    error,
    filters,
    setFilters,
    pagination,
    updateVMStatus,
    deleteVM
  } = useAdminVMs();

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value || undefined });
  };

  const handleUserChange = (value: string) => {
    setFilters({ ...filters, userId: value || undefined });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchTerm = formData.get('search') as string;
    setFilters({ ...filters, search: searchTerm });
  };

  const clearFilters = () => {
    setFilters({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Toutes les Machines Virtuelles</h1>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="running">En cours</SelectItem>
                <SelectItem value="stopped">Arrêtée</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
                <SelectItem value="creating">En création</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.userId} onValueChange={handleUserChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tous les utilisateurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les utilisateurs</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Input
                name="search"
                placeholder="Rechercher..."
                className="w-[200px]"
                defaultValue={filters.search}
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {(filters.status || filters.userId || filters.search) && (
            <Button onClick={clearFilters} variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {virtualMachines.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Configuration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Utilisation</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {virtualMachines.map((vm) => (
                  <TableRow key={vm.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{vm.name}</span>
                        <span className="text-sm text-muted-foreground">ID: {vm.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{vm.user.name}</span>
                        <span className="text-sm text-muted-foreground">{vm.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{vm.vcpu_count} vCPUs, {vm.memory_size_mib} MiB</span>
                        <span className="text-sm text-muted-foreground">{vm.disk_size_gb} GB</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vm.status === 'running' ? 'bg-green-100 text-green-800' :
                        vm.status === 'stopped' ? 'bg-red-100 text-red-800' :
                        vm.status === 'error' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {vm.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {vm.metrics && (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">CPU:</span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${vm.metrics.cpu_usage}%` }}
                              />
                            </div>
                            <span className="text-sm">{vm.metrics.cpu_usage}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">RAM:</span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${vm.metrics.memory_usage}%` }}
                              />
                            </div>
                            <span className="text-sm">{vm.metrics.memory_usage}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Disque:</span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-600 h-2 rounded-full"
                                style={{ width: `${vm.metrics.disk_usage}%` }}
                              />
                            </div>
                            <span className="text-sm">{vm.metrics.disk_usage}%</span>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/all-vms/${vm.id}`}>
                              Voir les détails
                            </Link>
                          </DropdownMenuItem>
                          {vm.status === 'stopped' && (
                            <DropdownMenuItem onClick={() => updateVMStatus(vm.id, 'start')}>
                              Démarrer
                            </DropdownMenuItem>
                          )}
                          {vm.status === 'running' && (
                            <>
                              <DropdownMenuItem onClick={() => updateVMStatus(vm.id, 'stop')}>
                                Arrêter
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateVMStatus(vm.id, 'restart')}>
                                Redémarrer
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => deleteVM(vm.id)}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 text-gray-400">🖥️</div>
              <p className="mt-2 text-muted-foreground">Aucune machine virtuelle trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>

      {virtualMachines.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Affichage de {virtualMachines.length} sur {pagination.total} machines virtuelles
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
              disabled={pagination.currentPage === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
              disabled={pagination.currentPage === pagination.lastPage}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
