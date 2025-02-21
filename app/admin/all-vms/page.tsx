// Fichier app/admin/all-vms/page.tsx 

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  EyeIcon, 
  PlayIcon, 
  StopIcon, 
  TrashIcon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  CpuChipIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface VirtualMachine {
  id: string;
  name: string;
  user: User;
  vcpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  status: 'running' | 'stopped' | 'error' | 'creating';
  cpu_usage_percent: number;
  memory_usage_mib: number;
}

export default function AllVirtualMachinesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [vms, setVms] = useState<VirtualMachine[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    user: searchParams.get('user') || '',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      // Fetch VMs with filters
      const queryParams = new URLSearchParams({
        ...(filters.status && { status: filters.status }),
        ...(filters.user && { user: filters.user }),
        ...(filters.search && { search: filters.search }),
      });

      const [vmsResponse, usersResponse] = await Promise.all([
        fetch(`/api/admin/virtual-machines?${queryParams}`),
        fetch('/api/admin/users')
      ]);

      if (!vmsResponse.ok || !usersResponse.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      const [vmsData, usersData] = await Promise.all([
        vmsResponse.json(),
        usersResponse.json()
      ]);

      setVms(vmsData);
      setUsers(usersData);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les machines virtuelles',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de gestion des filtres avec typage
  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update URL
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newParams.set(field, value);
    } else {
      newParams.delete(field);
    }
    router.push(`?${newParams.toString()}`);
  };

  const clearFilters = () => {
    setFilters({ status: '', user: '', search: '' });
    router.push('');
  };

  const handleVmAction = async (vmId: string, action: 'start' | 'stop' | 'delete') => {
    try {
      const response = await fetch(`/api/admin/virtual-machines/${vmId}/${action}`, {
        method: action === 'delete' ? 'DELETE' : 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'exécution de l\'action');
      }

      toast({
        title: 'Succès',
        description: action === 'delete' 
          ? 'Machine virtuelle supprimée'
          : `Machine virtuelle ${action === 'start' ? 'démarrée' : 'arrêtée'}`,
        variant: 'default',
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'running': return 'success';
      case 'stopped': return 'destructive';
      case 'error': return 'warning';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Toutes les Machines Virtuelles</h1>

        <div className="flex gap-3">
          <div className="flex gap-2">
            <Select
              value={filters.status}
              onValueChange={(value: string) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-[160px]">
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

            <Select
              value={filters.user}
              onValueChange={(value: string) => handleFilterChange('user', value)}
            >
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

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-[200px]"
              />
              <Button variant="outline" size="icon">
                <MagnifyingGlassIcon className="h-4 w-4" />
              </Button>
            </div>

            {(filters.status || filters.user || filters.search) && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card>
        <div className="p-4">
          {vms.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Configuration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Utilisation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vms.map((vm) => (
                    <TableRow key={vm.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{vm.name}</span>
                          <span className="text-sm text-gray-500">ID: {vm.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{vm.user.name}</span>
                          <span className="text-sm text-gray-500">{vm.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{vm.vcpu_count} vCPUs, {vm.memory_size_mib} MiB</span>
                          <span className="text-sm text-gray-500">{vm.disk_size_gb} GB</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(vm.status)}>
                          {vm.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CpuChipIcon className="h-4 w-4 text-gray-500" />
                            <Progress value={vm.cpu_usage_percent} className="flex-1" />
                            <span className="text-sm text-gray-500 w-12 text-right">
                              {vm.cpu_usage_percent}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CircleStackIcon className="h-4 w-4 text-gray-500" />
                            <Progress 
                              value={(vm.memory_usage_mib / vm.memory_size_mib) * 100} 
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-500 w-24 text-right">
                              {vm.memory_usage_mib}/{vm.memory_size_mib} MiB
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/admin/all-vms/${vm.id}`}>
                            <Button variant="outline" size="icon">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </Link>

                          {vm.status === 'stopped' && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleVmAction(vm.id, 'start')}
                            >
                              <PlayIcon className="h-4 w-4" />
                            </Button>
                          )}

                          {vm.status === 'running' && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleVmAction(vm.id, 'stop')}
                            >
                              <StopIcon className="h-4 w-4" />
                            </Button>
                          )}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cette machine virtuelle ?
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleVmAction(vm.id, 'delete')}
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">💻</div>
              <p className="text-gray-500 mb-4">Aucune machine virtuelle trouvée</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
