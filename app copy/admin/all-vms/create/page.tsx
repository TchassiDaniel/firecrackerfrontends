// Fichier app/admin/all-vms/create/page.tsx 

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const vmSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  cpu_count: z.number().min(1).max(8),
  memory_size: z.number().min(512).max(16384),
  disk_size: z.number().min(1).max(100),
  network_interface: z.string().min(1, "L'interface réseau est requise"),
  system_image_id: z.string().min(1, "L'image système est requise"),
  user_id: z.string().min(1, "L'utilisateur est requis"),
});

type VmFormValues = z.infer<typeof vmSchema>;

interface SystemImage {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

export default function CreateVmPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [systemImages, setSystemImages] = useState<SystemImage[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const form = useForm<VmFormValues>({
    resolver: zodResolver(vmSchema),
    defaultValues: {
      cpu_count: 1,
      memory_size: 1024,
      disk_size: 10,
      network_interface: "eth0",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger la liste des images système
        const imagesResponse = await fetch("/api/admin/system-images");
        if (!imagesResponse.ok) throw new Error("Erreur lors du chargement des images");
        const imagesData = await imagesResponse.json();
        
        // Charger la liste des utilisateurs
        const usersResponse = await fetch("/api/admin/users");
        if (!usersResponse.ok) throw new Error("Erreur lors du chargement des utilisateurs");
        const usersData = await usersResponse.json();
        
        setSystemImages(imagesData);
        setUsers(usersData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const onSubmit = async (data: VmFormValues) => {
    try {
      const response = await fetch("/api/admin/virtual-machines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur lors de la création");

      toast({
        title: "Succès",
        description: "Machine virtuelle créée avec succès",
      });

      router.push("/admin/all-vms");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la machine virtuelle",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Créer une Machine Virtuelle</h2>
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
                      <Input {...field} placeholder="Ma VM" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Utilisateur</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un utilisateur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpu_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de CPU (1-8)</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={8}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value: number[]) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <div className="text-sm text-gray-500">{field.value} CPU(s)</div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="memory_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mémoire RAM (512MB - 16GB)</FormLabel>
                    <FormControl>
                      <Slider
                        min={512}
                        max={16384}
                        step={512}
                        value={[field.value]}
                        onValueChange={(value: number[]) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <div className="text-sm text-gray-500">{field.value}MB</div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="disk_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taille du disque (1-100GB)</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value: number[]) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <div className="text-sm text-gray-500">{field.value}GB</div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="network_interface"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interface Réseau</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une interface" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="eth0">eth0</SelectItem>
                        <SelectItem value="eth1">eth1</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="system_image_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Système</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une image" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {systemImages.map((image) => (
                          <SelectItem key={image.id} value={image.id}>
                            {image.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/all-vms")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button type="submit">
                  Créer
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
