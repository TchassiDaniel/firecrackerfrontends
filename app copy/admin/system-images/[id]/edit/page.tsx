"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const imageSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  version: z.string().min(1, "La version est requise"),
  kernel_version: z.string().min(1, "La version du kernel est requise"),
  architecture: z.string().min(1, "L'architecture est requise"),
});

type ImageFormValues = z.infer<typeof imageSchema>;

interface SystemImage {
  id: string;
  name: string;
  description: string;
  version: string;
  kernel_version: string;
  architecture: string;
  size: number;
  status: string;
  created_at: string;
  last_used: string | null;
  checksum: string;
}

export default function EditSystemImagePage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
  });

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/admin/system-images/${id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement de l'image");
        const data: SystemImage = await response.json();
        
        form.reset({
          name: data.name,
          description: data.description,
          version: data.version,
          kernel_version: data.kernel_version,
          architecture: data.architecture,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger l'image système",
        });
        router.push("/admin/system-images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [id, form, router, toast]);

  const onSubmit = async (data: ImageFormValues) => {
    try {
      const response = await fetch(`/api/admin/system-images/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      toast({
        title: "Succès",
        description: "Image système mise à jour avec succès",
      });

      router.push("/admin/system-images");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'image système",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modifier l'Image Système</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/system-images")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Informations de l'Image</h2>
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
                      <Input {...field} placeholder="Ubuntu Server 22.04" />
                    </FormControl>
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
                      <Textarea
                        {...field}
                        placeholder="Une description détaillée de l'image système"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="22.04 LTS" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kernel_version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version du Kernel</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="5.15.0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="architecture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Architecture</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="x86_64">x86_64</SelectItem>
                          <SelectItem value="aarch64">aarch64</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">
                  Mettre à jour l'Image
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
