"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
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
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Clock,
  DollarSign,
  Globe,
  Key,
  Database,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { useVirtualMachines } from "@/hooks/useVirtualMachines";
import type { 
  VirtualMachine, 
  VMStatus, 
  VMMetrics, 
  SystemImage, 
  VMmodels,
  VMStatusHistory 
} from "@/types/virtualMachine";


export default function VirtualMachinePage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const vmId = parseInt(Array.isArray(id) ? id[0] : id || "0");
  
  
  const { 
    selectedVM: vm,
    isLoading,
    error,
    fetchVirtualMachineById, 
    fetchVMMetrics, 
    fetchVMStatusHistory,
    updateVirtualMachineStatus,
    deleteVirtualMachine,
    
  } = useVirtualMachines();
  
  const [metrics, setMetrics] = useState<VMMetrics | null>(null);
  const [statusHistory, setStatusHistory] = useState<VMStatusHistory[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const cardHover = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  const statusVariants: Record<VMStatus, string> = {
    running: "bg-gradient-to-r from-emerald-500 to-green-500",
    stopped: "bg-gradient-to-r from-red-500 to-rose-500",
    paused: "bg-gradient-to-r from-orange-500 to-red-500",
  };

  const fetchData = async () => {
    try {
      await fetchVirtualMachineById(vmId);
      const [metricsData, historyData] = await Promise.all([
        fetchVMMetrics(vmId),
        fetchVMStatusHistory(vmId)
      ]);

      setMetrics(metricsData);
      setStatusHistory(historyData);

      if (vm) {
        const createdAt = new Date(vm.created_at);
        const now = new Date();
        const hours = Math.ceil((now.getTime() - createdAt.getTime()) / 3600000);
        setTotalCost(hours * vm.vmModels.cpu);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors du chargement",
        description: "Impossible de charger les données de la machine virtuelle"
      });
      router.push("/virtual-machines");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [vmId]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error
      });
    }
  }, [error, toast]);

  const handleAction = async (action: 'start' | 'stop' | 'pause') => {
    try {
      await updateVirtualMachineStatus(vmId, action);
      toast({
        title: "Succès",
        description: `Action ${action} effectuée avec succès`
      });
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible d'effectuer l'action ${action}`
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVirtualMachine(vmId);
      toast({
        title: "Suppression réussie",
        description: "Machine virtuelle supprimée avec succès"
      });
      router.push("/virtual-machines");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la machine virtuelle"
      });
    }
  };

  const copySSHCommand = () => {
    if (!vm?.ip_address || !vm?.ssh_port) return;
    const command = `ssh -p ${vm.ssh_port} root@${vm.ip_address}`;
    navigator.clipboard.writeText(command);
    toast({
      title: "Commande copiée",
      description: "Commande SSH copiée dans le presse-papiers"
    });
  };

  if (isLoading || !vm || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <motion.div 
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          {/* Header Section */}
          <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outline"
                  onClick={() => router.push("/virtual-machines")}
                  className="bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  {vm.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-flex items-center px-4 py-1 rounded-full text-white text-sm ${statusVariants[vm.status]}`}>
                    {vm.status === "running" ? "En cours d'exécution" : 
                     vm.status === "stopped" ? "Arrêtée" : "Erreur"}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    Créée le {format(new Date(vm.created_at), "dd MMMM yyyy", { locale: fr })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {vm.status === "running" ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      variant="outline"
                      onClick={copySSHCommand}
                      disabled={!vm.ip_address || !vm.ssh_port}
                      className="bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copier SSH
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/virtual-machines/${vm.id}/terminal`)}
                      className="bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all"
                    >
                      <Terminal className="mr-2 h-4 w-4" />
                      Terminal
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      variant="destructive"
                      onClick={() => handleAction("stop")}
                      className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                    >
                      <PowerOff className="mr-2 h-4 w-4" />
                      Arrêter
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="default"
                    onClick={() => handleAction("start")}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  >
                    <Power className="mr-2 h-4 w-4" />
                    Démarrer
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/virtual-machines/${vm.id}/edit`)}
                  className="bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-slate-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. La machine virtuelle et toutes ses
                        données seront définitivement supprimées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Metrics and History */}
            <div className="lg:col-span-2 space-y-6">
              {/* System Metrics Card */}
              <motion.div
                variants={cardHover}
                whileHover="hover"
              >
                <Card className="overflow-hidden bg-white dark:bg-slate-800 shadow-lg">
                  <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-purple-500" />
                      Métriques système
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* CPU Usage */}
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <Cpu className="h-5 w-5 text-purple-500" />
                          <h3 className="font-medium">CPU</h3>
                        </div>
                        <Progress 
                          value={metrics.cpu_usage} 
                          className="h-2 mb-3"
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {metrics.cpu_usage}% de {vm.vcpu_count} vCPUs
                        </p>
                      </div>

                      {/* Memory Usage */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <MemoryStick className="h-5 w-5 text-blue-500" />
                          <h3 className="font-medium">Mémoire</h3>
                        </div>
                        <Progress 
                          value={(metrics.memory_usage / vm.memory_size_mib) * 100} 
                          className="h-2 mb-3"
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {metrics.memory_usage} MiB de {vm.memory_size_mib} MiB
                        </p>
                      </div>

                      {/* Disk Usage */}
                      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <HardDrive className="h-5 w-5 text-indigo-500" />
                          <h3 className="font-medium">Disque</h3>
                        </div>
                        <Progress 
                          value={(metrics.disk_usage / (vm.disk_size_gb * 1024)) * 100} 
                          className="h-2 mb-3"
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {metrics.disk_usage} MB de {vm.disk_size_gb} GB
                        </p>
                      </div>

                      {/* Network Usage */}
                      <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <Network className="h-5 w-5 text-violet-500" />
                          <h3 className="font-medium">Réseau</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-green-500 flex items-center">
                              <ArrowDown className="mr-2 h-4 w-4" />
                              Reçu
                            </span>
                            <span>{metrics.network_rx_bytes} MB</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-500 flex items-center">
                              <ArrowUp className="mr-2 h-4 w-4" />
                              Envoyé
                            </span>
                            <span>{metrics.network_tx_bytes} MB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Status History Card */}
              <motion.div
                variants={cardHover}
                whileHover="hover"
              >
                <Card className="bg-white dark:bg-slate-800 shadow-lg">
                  <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-500" />
                      Historique des statuts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
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
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${statusVariants[history.status]}`}>
                                  {history.status === "running" ? "En cours d'exécution" : 
                                   history.status === "stopped" ? "Arrêtée" : "Erreur"}
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Information Cards */}
            <div className="space-y-6">
              {/* VM Information Card */}
              <motion.div
                variants={cardHover}
                whileHover="hover"
              >
                <Card className="bg-white dark:bg-slate-800 shadow-lg">
                  <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-purple-500" />
                      Informations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Configuration Section */}
                      <div>
                        <h4 className="font-medium flex items-center gap-2 mb-4">
                          <Database className="h-4 w-4 text-blue-500" />
                          Configuration
                        </h4>
                        <dl className="space-y-3">
                          <div className="flex justify-between items-center">
                            <dt className="text-slate-500">Offre</dt>
                            <dd className="font-medium">{vm.vmModels.distribution_name}</dd>
                          </div>
                          <div className="flex justify-between items-center">
                            <dt className="text-slate-500">Image système</dt>
                            <dd className="font-medium">
                              {vm.systemImage.name} ({vm.systemImage.version})
                            </dd>
                          </div>
                          <div className="flex justify-between items-center">
                            <dt className="text-slate-500">vCPUs</dt>
                            <dd className="font-medium">{vm.vcpu_count}</dd>
                          </div>
                          <div className="flex justify-between items-center">
                            <dt className="text-slate-500">Mémoire</dt>
                            <dd className="font-medium">{vm.memory_size_mib} MiB</dd>
                          </div>
                          <div className="flex justify-between items-center">
                            <dt className="text-slate-500">Stockage</dt>
                            <dd className="font-medium">{vm.disk_size_gb} GB</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Network Section */}
                      <div>
                        <h4 className="font-medium flex items-center gap-2 mb-4">
                          <Globe className="h-4 w-4 text-green-500" />
                          Réseau
                        </h4>
                        <dl className="space-y-3">
                          <div className="flex justify-between items-center">
                            <dt className="text-slate-500">Adresse IP</dt>
                            <dd className="font-medium">{vm.ip_address || "-"}</dd>
                          </div>
                          <div className="flex justify-between items-center">
                            <dt className="text-slate-500">Port SSH</dt>
                            <dd className="font-medium">{vm.ssh_port || "-"}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Cost Section */}
                      <div>
                        <h4 className="font-medium flex items-center gap-2 mb-4">
                          <DollarSign className="h-4 w-4 text-yellow-500" />
                          Coût
                        </h4>
                        <dl className="space-y-3">
                          <div className="flex justify-between items-center">
                            <dt className="text-slate-500">Prix horaire</dt>
                            <dd className="font-medium">
                              ${vm.vmModels.cpu.toFixed(2)}/heure
                            </dd>
                          </div>
                          <div className="flex justify-between items-center">
                            <dt className="text-slate-500">Coût total</dt>
                            <dd className="font-medium text-lg text-green-600">
                              ${totalCost.toFixed(2)}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* SSH Connection Card */}
              {vm.status === "running" && vm.ip_address && vm.ssh_port && (
                <motion.div
                  variants={cardHover}
                  whileHover="hover"
                >
                  <Card className="bg-white dark:bg-slate-800 shadow-lg">
                    <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                      <CardTitle className="flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-purple-500" />
                        Connexion SSH
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <p className="text-sm text-slate-500">
                          Utilisez la commande suivante pour vous connecter :
                        </p>
                        <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm">
                          ssh -p {vm.ssh_port} root@{vm.ip_address}
                        </div>
                        <Button
                          variant="outline"
                          onClick={copySSHCommand}
                          className="w-full"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copier la commande
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}