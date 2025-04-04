// Fichier app/dashboard/page.tsx 

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  PlusCircle,
  Cloud,
  Terminal,
  Trash2,
  PlayCircle,
  StopCircle,
  CloudOff,
  Server,
  Activity,
  Power,
} from "lucide-react";
import Image from "next/image";

interface VirtualMachine {
  id: string;
  name: string;
  status: "running" | "stopped";
  ip_address: string | null;
  ssh_port: number | null;
}

const createVMSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  os_type: z.enum(["ubuntu", "debian", "alpine"], {
    required_error: "Veuillez sélectionner un système d'exploitation",
  }),
});

type CreateVMFormValues = z.infer<typeof createVMSchema>;

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [virtualMachines, setVirtualMachines] = useState<VirtualMachine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const form = useForm<CreateVMFormValues>({
    resolver: zodResolver(createVMSchema),
    defaultValues: {
      name: "",
      os_type: undefined,
    },
  });

  const onSubmit = async (data: CreateVMFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/virtual-machines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur lors de la création de la VM");

      toast({
        title: "Succès",
        description: "Machine virtuelle créée avec succès",
      });

      setShowCreateDialog(false);
      form.reset();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la machine virtuelle",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVM = async (id: string) => {
    try {
      const response = await fetch(`/api/virtual-machines/${id}/start`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Erreur lors du démarrage de la VM");

      toast({
        title: "Succès",
        description: "Machine virtuelle démarrée",
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de démarrer la machine virtuelle",
      });
    }
  };

  const handleStopVM = async (id: string) => {
    try {
      const response = await fetch(`/api/virtual-machines/${id}/stop`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Erreur lors de l'arrêt de la VM");

      toast({
        title: "Succès",
        description: "Machine virtuelle arrêtée",
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'arrêter la machine virtuelle",
      });
    }
  };

  const handleDeleteVM = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette machine virtuelle ?")) return;

    try {
      const response = await fetch(`/api/virtual-machines/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression de la VM");

      toast({
        title: "Succès",
        description: "Machine virtuelle supprimée",
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la machine virtuelle",
      });
    }
  };

  const runningVMs = virtualMachines.filter((vm) => vm.status === "running").length;
  const stoppedVMs = virtualMachines.filter((vm) => vm.status === "stopped").length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Machines Virtuelles</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle VM
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une Machine Virtuelle</DialogTitle>
              <DialogDescription>
                Configurez votre nouvelle machine virtuelle
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la VM</FormLabel>
                      <FormControl>
                        <Input placeholder="ma-vm-01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="os_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Système d'exploitation</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                            <Image
                              src="/assets/images/ubuntu.svg"
                              alt="Ubuntu"
                              width={48}
                              height={48}
                            />
                            <RadioGroupItem value="ubuntu" id="ubuntu" />
                            <label htmlFor="ubuntu" className="text-center">
                              <div className="font-medium">Ubuntu</div>
                              <div className="text-sm text-muted-foreground">
                                22.04 LTS
                              </div>
                            </label>
                          </div>
                          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                            <Image
                              src="/assets/images/debian.svg"
                              alt="Debian"
                              width={48}
                              height={48}
                            />
                            <RadioGroupItem value="debian" id="debian" />
                            <label htmlFor="debian" className="text-center">
                              <div className="font-medium">Debian</div>
                              <div className="text-sm text-muted-foreground">
                                11 Bullseye
                              </div>
                            </label>
                          </div>
                          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                            <Image
                              src="/assets/images/alpine.svg"
                              alt="Alpine"
                              width={48}
                              height={48}
                            />
                            <RadioGroupItem value="alpine" id="alpine" />
                            <label htmlFor="alpine" className="text-center">
                              <div className="font-medium">Alpine</div>
                              <div className="text-sm text-muted-foreground">
                                3.17
                              </div>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    <Cloud className="mr-2 h-4 w-4" />
                    Créer la VM
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <Server className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-4xl font-bold">{virtualMachines.length}</div>
            <p className="text-muted-foreground">Total VMs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-4xl font-bold text-green-500">{runningVMs}</div>
            <p className="text-muted-foreground">En cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Power className="h-8 w-8 mx-auto mb-2 text-gray-500" />
            <div className="text-4xl font-bold text-gray-500">{stoppedVMs}</div>
            <p className="text-muted-foreground">Arrêtées</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {virtualMachines.length === 0 ? (
            <div className="py-24 text-center">
              <CloudOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune machine virtuelle trouvée</p>
              <p className="text-sm text-muted-foreground">
                Cliquez sur le bouton "Nouvelle VM" pour créer votre première
                machine virtuelle.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead>Adresse IP</TableHead>
                    <TableHead>Port SSH</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {virtualMachines.map((vm) => (
                    <TableRow key={vm.id}>
                      <TableCell className="font-medium">{vm.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={vm.status === "running" ? "success" : "secondary"}
                        >
                          {vm.status === "running" ? "En cours" : "Arrêtée"}
                        </Badge>
                      </TableCell>
                      <TableCell>{vm.ip_address || "-"}</TableCell>
                      <TableCell>{vm.ssh_port || "-"}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {vm.status === "running" ? (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleStopVM(vm.id)}
                            >
                              <StopCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleStartVM(vm.id)}
                            >
                              <PlayCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              router.push(`/dashboard/${vm.id}/terminal`)
                            }
                          >
                            <Terminal className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteVM(vm.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
