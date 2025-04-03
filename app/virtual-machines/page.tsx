"use client";

import { useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Power, 
  Pause, 
  Trash2, 
  ExternalLink,
  Server,
  MemoryStick,
  HardDrive,
  Cpu,
  Globe,
  MoreVertical 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useVirtualMachines } from "@/hooks/useVirtualMachines";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'stopped':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default function VirtualMachinesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    virtualMachines,
    userVirtualMachines,
    isLoading,
    error,
    fetchUserVirtualMachines,
    updateVirtualMachineStatus,
    deleteVirtualMachine,
  } = useVirtualMachines();

  useEffect(() => {
    if (user?.id) {
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      if (!isNaN(userId)) {
        fetchUserVirtualMachines(userId);
      }
    }
  }, [user, fetchUserVirtualMachines]);

  const handleAction = async (vmId: number, action: "start" | "stop" | "pause") => {
    try {
      await updateVirtualMachineStatus(vmId, action);
      toast({
        title: "Action réussie",
        description: (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4 text-green-500" />
              <span>L'action a été effectuée avec succès</span>
            </div>
            <p>
              Machine virtuelle {action === 'start' ? 'démarrée' : action === 'stop' ? 'arrêtée' : 'mise en pause'}
            </p>
          </div>
        ),
        className: "bg-white border-l-4 border-l-green-500",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'état",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (vmId: number) => {
    try {
      await deleteVirtualMachine(vmId);
      toast({
        title: "Machine supprimée",
        description: "La machine virtuelle a été supprimée avec succès",
        className: "bg-white border-l-4 border-l-green-500",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la machine virtuelle",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              custom={i}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 animate-pulse" />
                <CardHeader className="relative">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Machines Virtuelles
            </h1>
            <p className="text-gray-500 mt-2">
              Gérez vos machines virtuelles Firecracker
            </p>
          </div>
          <Link href="/virtual-machines/create">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle VM
            </Button>
          </Link>
        </div>
      </motion.div>

      <AnimatePresence>
        {!userVirtualMachines || userVirtualMachines.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card className="border-dashed border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-gray-600">
                  <Server className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  Aucune machine virtuelle
                </CardTitle>
                <CardDescription className="text-center">
                  Commencez par créer votre première machine virtuelle
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Link href="/virtual-machines/create">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer ma première VM
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userVirtualMachines.map((vm, index) => (
              <motion.div
                key={vm.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={index}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="pb-2 relative">
                    <div className="flex justify-between items-start space-x-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                          <Server className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">{vm.name}</h2>
                          <p className="text-sm text-gray-500 mt-1">ID: {vm.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={vm.status} />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => handleAction(vm.id, "start")}
                              className="hover:bg-green-50 cursor-pointer"
                            >
                              <Power className="mr-2 h-4 w-4 text-green-500" />
                              <span>Démarrer</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction(vm.id, "stop")}
                              className="hover:bg-red-50 cursor-pointer"
                            >
                              <Power className="mr-2 h-4 w-4 text-red-500" />
                              <span>Arrêter</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction(vm.id, "pause")}
                              className="hover:bg-yellow-50 cursor-pointer"
                            >
                              <Pause className="mr-2 h-4 w-4 text-yellow-500" />
                              <span>Mettre en pause</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(vm.id)}
                              className="hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                              <span>Supprimer</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-blue-200 transition-colors duration-200 group/stat">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-500 group-hover/stat:bg-blue-100 transition-colors duration-200">
                          <MemoryStick className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">RAM</p>
                          <p className="text-lg font-semibold text-gray-900">{vm.memory_size_mib || 'N/A'} <span className="text-sm text-gray-500">MB</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-purple-200 transition-colors duration-200 group/stat">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-500 group-hover/stat:bg-purple-100 transition-colors duration-200">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">CPU</p>
                          <p className="text-lg font-semibold text-gray-900">{vm.vcpu_count || 'N/A'} <span className="text-sm text-gray-500">cœurs</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-orange-200 transition-colors duration-200 group/stat">
                        <div className="p-2 rounded-lg bg-orange-50 text-orange-500 group-hover/stat:bg-orange-100 transition-colors duration-200">
                          <HardDrive className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Stockage</p>
                          <p className="text-lg font-semibold text-gray-900">{vm.disk_size_gb || 'N/A'} <span className="text-sm text-gray-500">GB</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-green-200 transition-colors duration-200 group/stat">
                        <div className="p-2 rounded-lg bg-green-50 text-green-500 group-hover/stat:bg-green-100 transition-colors duration-200">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">IP</p>
                          <p className="text-lg font-semibold text-gray-900 font-mono">{vm.ip_address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}