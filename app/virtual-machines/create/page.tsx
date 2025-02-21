// Fichier app/virtual-machines/create/page.tsx 

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface SystemImage {
  id: string;
  name: string;
  version: string;
  os_type: string;
}

interface VmOffer {
  id: string;
  name: string;
  cpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  price_per_hour: number;
}

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  system_image_id: z.string().min(1, "Veuillez sélectionner une image système"),
  vm_offer_id: z.string().min(1, "Veuillez sélectionner une offre"),
});

export default function CreateVirtualMachinePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [systemImages, setSystemImages] = useState<SystemImage[]>([]);
  const [vmOffers, setVmOffers] = useState<VmOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<VmOffer | null>(null);
  const [selectedImage, setSelectedImage] = useState<SystemImage | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
      system_image_id: "",
      vm_offer_id: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imagesResponse, offersResponse] = await Promise.all([
          fetch("/api/system-images"),
          fetch("/api/vm-offers"),
        ]);

        if (!imagesResponse.ok || !offersResponse.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        const [images, offers] = await Promise.all([
          imagesResponse.json(),
          offersResponse.json(),
        ]);

        setSystemImages(images);
        setVmOffers(offers);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données",
        });
        router.push("/virtual-machines");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/virtual-machines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Erreur lors de la création");

      toast({
        title: "Succès",
        description: "Machine virtuelle créée avec succès",
      });
      router.push("/virtual-machines");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la machine virtuelle",
      });
    }
  };

  const handleOfferChange = (offerId: string) => {
    const offer = vmOffers.find((o) => o.id === offerId);
    setSelectedOffer(offer || null);
    form.setValue("vm_offer_id", offerId);
  };

  const handleImageChange = (imageId: string) => {
    const image = systemImages.find((i) => i.id === imageId);
    setSelectedImage(image || null);
    form.setValue("system_image_id", imageId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
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
          <h1 className="text-2xl font-bold">Créer une machine virtuelle</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle machine virtuelle</CardTitle>
              <CardDescription>
                Configurez votre nouvelle machine virtuelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ma VM" />
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe root</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="••••••••"
                          />
                        </FormControl>
                        <FormDescription>
                          Ce mot de passe sera utilisé pour accéder à votre VM en
                          tant qu&apos;utilisateur root
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
                          onValueChange={handleOfferChange}
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
                                {offer.name} - {offer.cpu_count} vCPUs,{" "}
                                {offer.memory_size_mib}MiB RAM,{" "}
                                {offer.disk_size_gb}GB - $
                                {offer.price_per_hour.toFixed(1)}/heure
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

                  <FormField
                    control={form.control}
                    name="system_image_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image système</FormLabel>
                        <Select
                          onValueChange={handleImageChange}
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
                                {image.name} - {image.os_type} Version:{" "}
                                {image.version}
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

                  <Button type="submit">Créer la machine virtuelle</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Offre sélectionnée</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedOffer ? (
                    <>
                      <strong>{selectedOffer.name}</strong>
                      <br />
                      {selectedOffer.cpu_count} vCPUs
                      <br />
                      {selectedOffer.memory_size_mib} MiB RAM
                      <br />
                      {selectedOffer.disk_size_gb} GB SSD
                      <br />
                      <span className="text-primary">
                        ${selectedOffer.price_per_hour.toFixed(1)}/heure
                      </span>
                    </>
                  ) : (
                    "Aucune offre sélectionnée"
                  )}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Image système</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedImage ? (
                    <>
                      <strong>{selectedImage.name}</strong>
                      <br />
                      {selectedImage.os_type}
                      <br />
                      Version {selectedImage.version}
                    </>
                  ) : (
                    "Aucune image sélectionnée"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
