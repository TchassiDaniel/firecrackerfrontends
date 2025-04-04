// Fichier app/dashboard/[id]/edit/page.tsx 

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

interface SystemImage {
  id: string;
  name: string;
  version: string;
}

interface VmOffer {
  id: string;
  name: string;
  cpu_count: number;
  memory_size: number;
  disk_size: number;
}

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
  const [isLoading, setIsLoading] = useState(true);
  const [systemImages, setSystemImages] = useState<SystemImage[]>([]);
  const [vmOffers, setVmOffers] = useState<VmOffer[]>([]);

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
        const [vmResponse, imagesResponse, offersResponse] = await Promise.all([
          fetch(`/api/virtual-machines/${id}`),
          fetch("/api/system-images"),
          fetch("/api/vm-offers"),
        ]);

        if (!vmResponse.ok || !imagesResponse.ok || !offersResponse.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        const [vm, images, offers] = await Promise.all([
          vmResponse.json(),
          imagesResponse.json(),
          offersResponse.json(),
        ]);

        setSystemImages(images);
        setVmOffers(offers);

        form.reset({
          name: vm.name,
          description: vm.description || "",
          system_image_id: vm.system_image_id,
          vm_offer_id: vm.vm_offer_id,
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
  }, [id, router, toast, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/virtual-machines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      toast({
        title: "Succès",
        description: "Machine virtuelle mise à jour avec succès",
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
    try {
      const response = await fetch(`/api/virtual-machines/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      toast({
        title: "Succès",
        description: "Machine virtuelle supprimée avec succès",
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
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
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
            onClick={() => router.push(`/dashboard/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Modifier la machine virtuelle</h1>
        </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Informations de la machine virtuelle</CardTitle>
          <CardDescription>
            Modifiez les paramètres de votre machine virtuelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Le nom de votre machine virtuelle
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Une brève description de votre machine virtuelle (optionnel)
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une image système" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {systemImages.map((image) => (
                          <SelectItem key={image.id} value={image.id}>
                            {image.name} ({image.version})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Le système d&apos;exploitation de votre machine virtuelle
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
                    <FormLabel>Offre</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une offre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vmOffers.map((offer) => (
                          <SelectItem key={offer.id} value={offer.id}>
                            {offer.name} ({offer.cpu_count} CPU, {
                              offer.memory_size
                            }{" "}
                            Go RAM, {offer.disk_size} Go SSD)
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
