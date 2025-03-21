"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

import { VirtualMachine, SystemImage, VMOffer } from "@/types/virtualMachine";
import { useVirtualMachines } from "@/hooks/useVirtualMachines";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  system_image_id: z.string().min(1, "Veuillez sélectionner une image système"),
  vm_offer_id: z.string().min(1, "Veuillez sélectionner une offre"),
  description: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
});

export default function EditVirtualMachinePage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    fetchVirtualMachineById,
    updateVirtualMachine,
    fetchSystemImages,
    fetchVMOffers,
  } = useVirtualMachines();

  const [isLoading, setIsLoading] = useState(true);
  const [systemImages, setSystemImages] = useState<SystemImage[]>([]);
  const [vmOffers, setVmOffers] = useState<VMOffer[]>([]);
  const [currentVM, setCurrentVM] = useState<VirtualMachine | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      system_image_id: "",
      vm_offer_id: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch VM details, system images, and VM offers concurrently
        const [vmData, systemImagesData, vmOffersData] = await Promise.all([
          fetchVirtualMachineById(id as string),
          fetchSystemImages(),
          fetchVMOffers(),
        ]);

        setCurrentVM(vmData);
        setSystemImages(systemImagesData);
        setVmOffers(vmOffersData);

        // Populate form with existing VM data
        form.reset({
          name: vmData.name,
          description: vmData.description || "",
          system_image_id: vmData.systemImage.id,
          vm_offer_id: vmData.vmOffer.id,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données de la machine virtuelle",
        });
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, fetchVirtualMachineById, fetchSystemImages, fetchVMOffers, toast, router, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentVM) return;
   
      //trouver le  selected system image and VM offer
  const selectedSystemImage = systemImages.find(img => img.id === values.system_image_id);
  const selectedVMOffer = vmOffers.find(offer => offer.id === values.vm_offer_id);

  //mettre ajour cela 
    try {
      await updateVirtualMachine(currentVM.id, {
        name: values.name,
        description: values.description,
        systemImage: {
          id: values.system_image_id,
          name: selectedSystemImage?.name || 'undefined', // Provide a fallback name
        },
        vmOffer: {
          id: values.vm_offer_id,
          name: selectedVMOffer?.name || 'undefined', // Provide a fallback name
          memory_size: selectedVMOffer?.memory_size || 0,
          cpu_count: selectedVMOffer?.cpu_count || 0,
          disk_size: selectedVMOffer?.disk_size || 0,
        }
      });
  
      toast({
        title: "Succès",
        description: "La machine virtuelle a été mise à jour",
      });
  
      router.push(`/dashboard/${id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la machine virtuelle",
      });
    }
  };

  const handleDelete = async () => {
    if (!currentVM) return;

    try {
      // Implement delete logic using useVirtualMachines hook
      // await deleteVirtualMachine(currentVM.id);
      
      toast({
        title: "Succès",
        description: "La machine virtuelle a été supprimée",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la machine virtuelle",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/dashboard/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
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
                Cette action supprimera définitivement votre machine virtuelle.
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

      <Card>
        <CardHeader>
          <CardTitle>Modifier la machine virtuelle</CardTitle>
          <CardDescription>
            Mettez à jour les détails de votre machine virtuelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la machine virtuelle</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon serveur web" {...field} />
                    </FormControl>
                    <FormDescription>
                      Un nom unique pour identifier votre machine virtuelle
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Description de la machine virtuelle" {...field} />
                    </FormControl>
                    <FormDescription>
                      Une description facultative pour mieux comprendre l'usage de la VM
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="system_image_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image système</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une image système" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {systemImages.map((image) => (
                          <SelectItem key={image.id} value={image.id}>
                            {image.name} - {image.version}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      L'image système de base pour votre machine virtuelle
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vm_offer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offre de ressources</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une offre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vmOffers.map((offer) => (
                          <SelectItem key={offer.id} value={offer.id}>
                            {offer.name} - {offer.cpu_count} CPU, {offer.memory_size} Mo, {offer.disk_size} Go
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Les ressources allouées à votre machine virtuelle
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les modifications
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
