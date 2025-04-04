// Fichier app/admin/all-vms/[id]/page.tsx 

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  PlayIcon, 
  StopIcon, 
  TrashIcon,
  CpuChipIcon,
  CircleStackIcon,
  ServerIcon,
  GlobeAltIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface SystemImage {
  id: string;
  name: string;
}

interface VmOffer {
  id: string;
  name: string;
}

interface Historic {
  id: string;
  status: string;
  created_at: string;
}

interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'creating';
  user: User;
  created_at: string;
  vcpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  systemImage: SystemImage;
  vmOffer: VmOffer;
  ip_address: string;
  mac_address: string;
  tap_device_name: string;
  tap_ip: string;
  network_namespace: string;
  cpu_usage_percent: number;
  memory_usage_mib: number;
  historics: Historic[];
}

function formatBytes(bytes: number, precision = 2) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}

export default function VirtualMachineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [vm, setVm] = useState<VirtualMachine | null>(null);

  useEffect(() => {
    fetchVmDetails();
  }, []);

  const fetchVmDetails = async () => {
    try {
      const response = await fetch(`/api/admin/virtual-machines/${params.id}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }
      const data = await response.json();
      setVm(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les détails de la machine virtuelle',
        variant: 'destructive',
      });
      router.push('/admin/all-vms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVmAction = async (action: 'start' | 'stop' | 'delete') => {
    try {
      const response = await fetch(`/api/admin/virtual-machines/${params.id}/${action}`, {
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

      if (action === 'delete') {
        router.push('/admin/all-vms');
      } else {
        fetchVmDetails();
      }
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

  if (isLoading || !vm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {/* Informations principales */}
          <Card>
            <div className="p-4">
              <h5 className="text-lg font-semibold mb-4">Informations de la VM</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom</label>
                  <p className="mt-1">{vm.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <Badge variant={getStatusBadgeVariant(vm.status)}>
                      {vm.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Propriétaire</label>
                  <p className="mt-1">
                    {vm.user.name}
                    <span className="block text-sm text-gray-500">{vm.user.email}</span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Créée le</label>
                  <p className="mt-1">{new Date(vm.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Configuration */}
          <Card>
            <div className="p-4">
              <h5 className="text-lg font-semibold mb-4">Configuration</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">vCPUs</label>
                  <p className="mt-1">{vm.vcpu_count}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">RAM</label>
                  <p className="mt-1">{vm.memory_size_mib} MiB</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Disque</label>
                  <p className="mt-1">{vm.disk_size_gb} GB</p>
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm font-medium text-gray-500">Image Système</label>
                  <p className="mt-1">{vm.systemImage.name}</p>
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm font-medium text-gray-500">Offre</label>
                  <p className="mt-1">{vm.vmOffer.name}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Réseau */}
          <Card>
            <div className="p-4">
              <h5 className="text-lg font-semibold mb-4">Configuration Réseau</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Adresse IP</label>
                  <p className="mt-1">{vm.ip_address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Adresse MAC</label>
                  <p className="mt-1">{vm.mac_address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Interface TAP</label>
                  <p className="mt-1">{vm.tap_device_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">IP TAP</label>
                  <p className="mt-1">{vm.tap_ip}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Namespace Réseau</label>
                  <p className="mt-1">{vm.network_namespace}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Historique */}
          <Card>
            <div className="p-4">
              <h5 className="text-lg font-semibold mb-4">Historique</h5>
              {vm.historics.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vm.historics.map((historic) => (
                      <TableRow key={historic.id}>
                        <TableCell>
                          {new Date(historic.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(historic.status)}>
                            {historic.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500">Aucun historique disponible</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Actions */}
          <Card>
            <div className="p-4">
              <h5 className="text-lg font-semibold mb-4">Actions</h5>
              <div className="space-y-2">
                {vm.status === 'stopped' && (
                  <Button
                    className="w-full"
                    variant="default"
                    onClick={() => handleVmAction('start')}
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Démarrer
                  </Button>
                )}

                {vm.status === 'running' && (
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => handleVmAction('stop')}
                  >
                    <StopIcon className="h-4 w-4 mr-2" />
                    Arrêter
                  </Button>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      variant="outline"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Supprimer
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
                        onClick={() => handleVmAction('delete')}
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>

          {/* Utilisation */}
          <Card>
            <div className="p-4">
              <h5 className="text-lg font-semibold mb-4">Utilisation</h5>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-500">CPU</label>
                    <span className="text-sm text-gray-500">{vm.cpu_usage_percent}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CpuChipIcon className="h-4 w-4 text-gray-500" />
                    <Progress value={vm.cpu_usage_percent} className="flex-1" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-500">Mémoire</label>
                    <span className="text-sm text-gray-500">
                      {vm.memory_usage_mib}/{vm.memory_size_mib} MiB
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleStackIcon className="h-4 w-4 text-gray-500" />
                    <Progress 
                      value={(vm.memory_usage_mib / vm.memory_size_mib) * 100} 
                      className="flex-1" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
