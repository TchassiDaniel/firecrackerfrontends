// Fichier app/virtual-machines/page.tsx 

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  MoreVertical,
  Search,
  RefreshCw,
  Power,
  PowerOff,
  Terminal,
  Settings,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface VirtualMachine {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
  ip_address: string | null;
  created_at: string;
  system_image: {
    name: string;
    version: string;
  };
  vm_offer: {
    name: string;
    cpu_count: number;
    memory_size: number;
    disk_size: number;
  };
}

export default function VirtualMachinesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [virtualMachines, setVirtualMachines] = useState<VirtualMachine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchVirtualMachines = async () => {
    try {
      const response = await fetch("/api/virtual-machines");
      if (!response.ok) throw new Error("Erreur lors du chargement des données");
      const data = await response.json();
      setVirtualMachines(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les machines virtuelles",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVirtualMachines();
  }, []);

  const handleAction = async (vmId: string, action: string) => {
    try {
      const response = await fetch(`/api/virtual-machines/${vmId}/${action}`, {
        method: "POST",
      });

      if (!response.ok) throw new Error(`Erreur lors de l'action ${action}`);

      toast({
        title: "Succès",
        description: `Action ${action} effectuée avec succès`,
      });

      fetchVirtualMachines();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible d'effectuer l'action ${action}`,
      });
    }
  };

  const handleDelete = async (vmId: string) => {
    try {
      const response = await fetch(`/api/virtual-machines/${vmId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      toast({
        title: "Succès",
        description: "Machine virtuelle supprimée avec succès",
      });

      fetchVirtualMachines();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la machine virtuelle",
      });
    }
  };

  const filteredVMs = virtualMachines.filter((vm) => {
    const matchesSearch =
      vm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vm.system_image.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || vm.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-500";
      case "stopped":
        return "text-gray-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "running":
        return "En cours d'exécution";
      case "stopped":
        return "Arrêtée";
      case "error":
        return "Erreur";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
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
        <h1 className="text-2xl font-bold">Machines Virtuelles</h1>
        <Button onClick={() => router.push("/virtual-machines/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle VM
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
            <CardDescription>Nombre total de VMs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{virtualMachines.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>En cours d&apos;exécution</CardTitle>
            <CardDescription>VMs actives</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">
              {
                virtualMachines.filter((vm) => vm.status === "running")
                  .length
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Arrêtées</CardTitle>
            <CardDescription>VMs inactives</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-500">
              {
                virtualMachines.filter((vm) => vm.status === "stopped")
                  .length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des machines virtuelles</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une VM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="running">En cours d&apos;exécution</SelectItem>
                <SelectItem value="stopped">Arrêtées</SelectItem>
                <SelectItem value="error">En erreur</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={fetchVirtualMachines}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Image système</TableHead>
                  <TableHead>Configuration</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Créée le</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVMs.map((vm) => (
                  <TableRow key={vm.id}>
                    <TableCell className="font-medium">{vm.name}</TableCell>
                    <TableCell>
                      {vm.system_image.name} ({vm.system_image.version})
                    </TableCell>
                    <TableCell>
                      {vm.vm_offer.cpu_count} CPU, {vm.vm_offer.memory_size} Go
                      RAM, {vm.vm_offer.disk_size} Go SSD
                    </TableCell>
                    <TableCell>
                      <span className={getStatusColor(vm.status)}>
                        {getStatusText(vm.status)}
                      </span>
                    </TableCell>
                    <TableCell>{vm.ip_address || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(vm.created_at), "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {vm.status === "running" ? (
                            <DropdownMenuItem
                              onClick={() => handleAction(vm.id, "stop")}
                            >
                              <PowerOff className="mr-2 h-4 w-4" />
                              Arrêter
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleAction(vm.id, "start")}
                            >
                              <Power className="mr-2 h-4 w-4" />
                              Démarrer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/virtual-machines/${vm.id}/terminal`)
                            }
                          >
                            <Terminal className="mr-2 h-4 w-4" />
                            Terminal SSH
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/virtual-machines/${vm.id}/edit`)
                            }
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(vm.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}