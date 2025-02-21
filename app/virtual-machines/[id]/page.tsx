// Fichier app/virtual-machines/[id]/page.tsx 

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  Power,
  PowerOff,
  Terminal,
  Settings,
  Trash2,
  Copy,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VirtualMachine {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
  created_at: string;
  vcpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  ip_address: string | null;
  ssh_port: number | null;
  system_image: {
    name: string;
    version: string;
    os_type: string;
  };
  vm_offer: {
    name: string;
    price_per_hour: number;
  };
}

interface Metrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_rx: number;
  network_tx: number;
}

interface StatusHistory {
  id: string;
  status: string;
  created_at: string;
}

export default function VirtualMachinePage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [vm, setVM] = useState<VirtualMachine | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  const fetchData = async () => {
    try {
      const [vmResponse, metricsResponse, historyResponse] = await Promise.all([
        fetch(`/api/virtual-machines/${id}`),
        fetch(`/api/virtual-machines/${id}/metrics`),
        fetch(`/api/virtual-machines/${id}/status-history`),
      ]);

      if (!vmResponse.ok || !metricsResponse.ok || !historyResponse.ok) {
        throw new Error("Erreur lors du chargement des données");
      }

      const [vmData, metricsData, historyData] = await Promise.all([
        vmResponse.json(),
        metricsResponse.json(),
        historyResponse.json(),
      ]);

      setVM(vmData);
      setMetrics(metricsData);
      setStatusHistory(historyData);

      // Calculer le coût total
      const createdAt = new Date(vmData.created_at);
      const now = new Date();
      const hours = Math.ceil((now.getTime() - createdAt.getTime()) / 3600000);
      setTotalCost(hours * vmData.vm_offer.price_per_hour);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données de la machine virtuelle",
      });
      router.push("/virtual-machines");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Actualiser les métriques toutes les 30 secondes
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [id, router, toast]);

  const handleAction = async (action: string) => {
    try {
      const response = await fetch(`/api/virtual-machines/${id}/${action}`, {
        method: "POST",
      });

      if (!response.ok) throw new Error(`Erreur lors de l'action ${action}`);

      toast({
        title: "Succès",
        description: `Action ${action} effectuée avec succès`,
      });

      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible d'effectuer l'action ${action}`,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/virtual-machines/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      toast({
        title: "Succès",
        description: "Machine virtuelle supprimée avec succès",
      });
      router.push("/virtual-machines");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la machine virtuelle",
      });
    }
  };

  const copySSHCommand = () => {
    if (!vm?.ip_address || !vm?.ssh_port) return;

    const command = `ssh -p ${vm.ssh_port} root@${vm.ip_address}`;
    navigator.clipboard.writeText(command);

    toast({
      title: "Copié !",
      description: "Commande SSH copiée dans le presse-papiers",
    });
  };

  if (isLoading || !vm || !metrics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/virtual-machines")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{vm.name}</h1>
            <p className="text-muted-foreground">
              <span
                className={`inline-flex items-center ${
                  vm.status === "running"
                    ? "text-green-500"
                    : vm.status === "error"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current mr-2" />
                {vm.status === "running"
                  ? "En cours d'exécution"
                  : vm.status === "stopped"
                  ? "Arrêtée"
                  : "Erreur"}
              </span>
              <span className="mx-2">•</span>
              Créée le{" "}
              {format(new Date(vm.created_at), "dd MMMM yyyy", {
                locale: fr,
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {vm.status === "running" ? (
            <>
              <Button
                variant="outline"
                onClick={copySSHCommand}
                disabled={!vm.ip_address || !vm.ssh_port}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copier la commande SSH
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/virtual-machines/${vm.id}/terminal`)
                }
              >
                <Terminal className="mr-2 h-4 w-4" />
                Terminal SSH
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction("stop")}
              >
                <PowerOff className="mr-2 h-4 w-4" />
                Arrêter
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              onClick={() => handleAction("start")}
            >
              <Power className="mr-2 h-4 w-4" />
              Démarrer
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.push(`/virtual-machines/${vm.id}/edit`)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. La machine virtuelle et toutes ses
                  données seront définitivement supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Métriques système */}
          <Card>
            <CardHeader>
              <CardTitle>Métriques système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CPU Usage */}
                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="text-sm font-medium mb-2">Utilisation CPU</h3>
                  <Progress value={metrics.cpu_usage} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {metrics.cpu_usage}% de {vm.vcpu_count} vCPUs
                  </p>
                </div>

                {/* Memory Usage */}
                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="text-sm font-medium mb-2">
                    Utilisation mémoire
                  </h3>
                  <Progress
                    value={(metrics.memory_usage / vm.memory_size_mib) * 100}
                    className="mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {metrics.memory_usage} MiB de {vm.memory_size_mib} MiB
                  </p>
                </div>

                {/* Disk Usage */}
                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="text-sm font-medium mb-2">
                    Utilisation disque
                  </h3>
                  <Progress
                    value={(metrics.disk_usage / (vm.disk_size_gb * 1024)) * 100}
                    className="mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {metrics.disk_usage} MB de {vm.disk_size_gb} GB
                  </p>
                </div>

                {/* Network Usage */}
                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="text-sm font-medium mb-2">Réseau</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-500 flex items-center">
                        <ArrowDown className="mr-2 h-4 w-4" />
                        Reçu
                      </span>
                      <span>{metrics.network_rx} MB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-500 flex items-center">
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Envoyé
                      </span>
                      <span>{metrics.network_tx} MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historique des statuts */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des statuts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>
                        <span
                          className={`inline-flex items-center ${
                            history.status === "running"
                              ? "text-green-500"
                              : history.status === "error"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current mr-2" />
                          {history.status === "running"
                            ? "En cours d'exécution"
                            : history.status === "stopped"
                            ? "Arrêtée"
                            : "Erreur"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {format(new Date(history.created_at), "dd MMM yyyy HH:mm", {
                          locale: fr,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Informations de la VM */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Configuration</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Offre</dt>
                    <dd className="font-medium">{vm.vm_offer.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Image système</dt>
                    <dd className="font-medium">
                      {vm.system_image.name} ({vm.system_image.version})
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">vCPUs</dt>
                    <dd className="font-medium">{vm.vcpu_count}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Mémoire</dt>
                    <dd className="font-medium">{vm.memory_size_mib} MiB</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Stockage</dt>
                    <dd className="font-medium">{vm.disk_size_gb} GB</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium mb-2">Réseau</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Adresse IP</dt>
                    <dd className="font-medium">{vm.ip_address || "-"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Port SSH</dt>
                    <dd className="font-medium">{vm.ssh_port || "-"}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium mb-2">Coût</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Prix horaire</dt>
                    <dd className="font-medium">
                      ${vm.vm_offer.price_per_hour.toFixed(1)}/heure
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Coût total</dt>
                    <dd className="font-medium">${totalCost.toFixed(2)}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>

          {/* Connexion SSH */}
          {vm.status === "running" && vm.ip_address && vm.ssh_port && (
            <Card>
              <CardHeader>
                <CardTitle>Connexion SSH</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Utilisez la commande suivante pour vous connecter à votre VM :
                    </p>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm">
                      ssh -p {vm.ssh_port} root@{vm.ip_address}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={copySSHCommand}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copier la commande
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
