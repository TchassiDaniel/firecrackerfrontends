// Fichier app/admin/vm-offers/page.tsx 

'use client';

import { useEffect, useState } from 'react';
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
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface VmOffer {
  id: string;
  name: string;
  description: string;
  vcpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  price_per_hour: number;
  is_active: boolean;
  active_vms_count: number;
}

export default function VmOffersPage() {
  const [offers, setOffers] = useState<VmOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOffers();
  }, [currentPage]);

  const fetchOffers = async () => {
    try {
      const response = await fetch(`/api/admin/vm-offers?page=${currentPage}`);
      const data = await response.json();
      setOffers(data.offers);
      setTotalPages(data.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching VM offers:', error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (offerId: string) => {
    try {
      const response = await fetch(`/api/admin/vm-offers/${offerId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchOffers();
      } else {
        console.error('Failed to delete VM offer');
      }
    } catch (error) {
      console.error('Error deleting VM offer:', error);
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
        <h1 className="text-2xl font-bold">Gestion des Offres VM</h1>
        <Link href="/admin/vm-offers/create" passHref>
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouvelle Offre
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-4">
          {offers.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>CPU</TableHead>
                      <TableHead>RAM</TableHead>
                      <TableHead>Disque</TableHead>
                      <TableHead>Prix/Heure</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>VMs Actives</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{offer.name}</div>
                            <div className="text-sm text-gray-500">
                              {offer.description.length > 50
                                ? `${offer.description.substring(0, 50)}...`
                                : offer.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{offer.vcpu_count} vCPUs</TableCell>
                        <TableCell>{offer.memory_size_mib} MiB</TableCell>
                        <TableCell>{offer.disk_size_gb} GB</TableCell>
                        <TableCell>${offer.price_per_hour.toFixed(3)}/h</TableCell>
                        <TableCell>
                          <Badge variant={offer.is_active ? "success" : "destructive"}>
                            {offer.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{offer.active_vms_count}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/admin/vm-offers/${offer.id}`}>
                              <Button variant="outline" size="icon">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/vm-offers/${offer.id}/edit`}>
                              <Button variant="outline" size="icon">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            </Link>
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
                                    Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(offer.id)}>
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

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <p className="text-gray-500 mb-4">Aucune offre VM n'a été créée</p>
              <Link href="/admin/vm-offers/create" passHref>
                <Button>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Créer une offre
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
