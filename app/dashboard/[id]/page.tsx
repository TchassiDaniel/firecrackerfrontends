// Fichier app/dashboard/[id]/page.tsx 

'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, Cpu, HardDrive, Network } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatBytes, formatNumber } from '@/lib/utils';
import { VirtualMachine } from '@/types/virtualMachine';
import { useVirtualMachines } from '@/hooks/useVirtualMachines';
import {useAuth} from '@/hooks/useAuth'

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { virtualMachines, isLoading, error, fetchVirtualMachines, fetchUserVirtualMachines, updateVirtualMachineStatus } = useVirtualMachines();
  const [vm, setVm] = useState<VirtualMachine | null>(null);
  

//je recupere toutes les machines virtuelles de cet utilisateur

const { user } = useAuth();
const userId = user?.id;

useEffect(() => {
  if (userId) {
    fetchUserVirtualMachines(Number(userId));
  }
}, [userId]);

    



// ce useEffect definit la machine specifique a afficher

    useEffect(() => {

      //on verifie d'abord que les machines sont charges dans le tableau
      if (virtualMachines.length > 0) {

        //on cherche la vm dont l'id correspond a l'id dans l'url de la page
        const selectedVm = virtualMachines.find((machine) => machine.id === Number(params.id));
       
        //vm sera vide si on ne trouve pas la vm selectionne
        setVm(selectedVm || null); 
      }
    }, [virtualMachines, params.id]);// ca prend en parametre id de l'url


    const handleVmAction = async (action: 'start' | 'stop') => {
      try {

        const vmId = (params.id as string);
        await updateVirtualMachineStatus(Number(vmId), action);
        toast({
          title: 'Succès',
          description: `La machine virtuelle a bien été ${action === 'start' ? 'démarrée' : 'arrêtée'}.`,
        });
        fetchUserVirtualMachines(Number(userId)); // Rafraîchir les données
      } catch (error) {
        toast({
          title: 'Erreur',
          description: `Impossible de ${action === 'start' ? 'démarrer' : 'arrêter'} la VM.`,
          variant: 'destructive',
        });
      }
    };
  
    if (isLoading) return <div>Chargement...</div>;
    if (!vm) return <div>Aucune machine virtuelle trouvée.</div>;

 return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{vm.name}</h1>
        <div className="space-x-2">
          {vm.status === 'stopped' && (
            <Button onClick={() => handleVmAction('start')} variant="default" className="bg-green-600 hover:bg-green-700">
              Démarrer
            </Button>
          )}
          {vm.status === 'running' && (
            <Button onClick={() => handleVmAction('stop')} variant="destructive">
              Arrêter
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Retour au tableau de bord
          </Button>
        </div>
      </div>

      {/* Status et métriques */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Statut</div>
              <div className="mt-1">
                <span className={`px-2 inline-flex text-xs font-semibold rounded-full
                  ${vm.status === 'running' ? 'bg-green-100 text-green-800' :
                    vm.status === 'stopped' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'}`}
                >
                  {vm.status}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span className="text-sm text-gray-600">Utilisation CPU</span>
              </div>
              <div className="mt-1 text-xl font-semibold">{formatNumber(vm.metrics.cpu_usage)}%</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <span className="text-sm text-gray-600">Mémoire</span>
              </div>
              <div className="mt-1 text-xl font-semibold">{vm.metrics.memory_usage} / {vm.memory_size_mib} MiB</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                <span className="text-sm text-gray-600">Réseau</span>
              </div>
              <div className="mt-1 text-sm">
                <div className="flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  {formatBytes(vm.metrics.network_rx_bytes)}
                </div>
                <div className="flex items-center gap-1">
                  <ArrowRight className="h-4 w-4" />
                  {formatBytes(vm.metrics.network_tx_bytes)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
