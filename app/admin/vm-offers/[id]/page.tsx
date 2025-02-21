// Fichier app/admin/vm-offers/[id]/page.tsx 

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { ArrowLeftIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/components/ui/use-toast';

interface VirtualMachine {
  id: string;
  name: string;
  status: string;
  created_at: string;
  user: {
    name: string;
  };
}

interface VmOffer {
  id: string;
  name: string;
  description: string;
  vcpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  price_per_hour: number;
  is_active: boolean;
  virtualMachines: VirtualMachine[];
}

interface Props {
  params: {
    id: string;
  };
}

export default function VmOfferDetailsPage({ params }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [offer, setOffer] = useState<VmOffer | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`/api/admin/vm-offers/${params.id}`);
        if (!response.ok) throw new Error('Offre non trouvée');
        const data = await response.json();
        setOffer(data);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger l\'offre VM',
          variant: 'destructive',
        });
        router.push('/admin/vm-offers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, [params.id, router, toast]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/vm-offers/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Succès',
          description: 'L\'offre VM a été supprimée avec succès.',
          variant: 'default',
        });
        router.push('/admin/vm-offers');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  if (isLoading || !offer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Détails de l'Offre VM</h1>

            <div className="space-y-6">
              {/* Informations Générales */}
              <div>
                <h2 className="text-lg font-semibold text-gray-600 mb-3">Informations Générales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Nom</label>
                    <p className="font-medium">{offer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div>
                      <Badge variant={offer.is_active ? "success" : "destructive"}>
                        {offer.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-500">Description</label>
                    <p className="font-medium">{offer.description || 'Aucune description'}</p>
                  </div>
                </div>
              </div>

              {/* Spécifications Techniques */}
              <div>
                <h2 className="text-lg font-semibold text-gray-600 mb-3">Spécifications Techniques</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">vCPUs</label>
                    <p className="font-medium">{offer.vcpu_count}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">RAM</label>
                    <p className="font-medium">{offer.memory_size_mib} MiB</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Disque</label>
                    <p className="font-medium">{offer.disk_size_gb} GB</p>
                  </div>
                </div>
              </div>

              {/* Tarification */}
              <div>
                <h2 className="text-lg font-semibold text-gray-600 mb-3">Tarification</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Prix par heure</label>
                    <p className="font-medium">${offer.price_per_hour.toFixed(3)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Prix par mois (estimé)</label>
                    <p className="font-medium">${(offer.price_per_hour * 24 * 30).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Machines Virtuelles */}
              <div>
                <h2 className="text-lg font-semibold text-gray-600 mb-3">
                  Machines Virtuelles Utilisant cette Offre
                </h2>
                {offer.virtualMachines.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Créée le</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {offer.virtualMachines.map((vm) => (
                          <TableRow key={vm.id}>
                            <TableCell>{vm.name}</TableCell>
                            <TableCell>{vm.user.name}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  vm.status === 'running' 
                                    ? 'success' 
                                    : vm.status === 'stopped' 
                                      ? 'destructive' 
                                      : 'default'
                                }
                              >
                                {vm.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(vm.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Link href={`/admin/all-vms/${vm.id}`}>
                                <Button variant="outline" size="icon">
                                  <EyeIcon className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune machine virtuelle n'utilise cette offre</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4">
                <Link href="/admin/vm-offers">
                  <Button variant="outline">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                </Link>
                <div className="space-x-2">
                  <Link href={`/admin/vm-offers/${offer.id}/edit`}>
                    <Button variant="outline">
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
