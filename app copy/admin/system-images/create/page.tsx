// Fichier app/admin/system-images/create/page.tsx 

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { ArrowLeft, Upload } from "lucide-react";

const imageSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  version: z.string().min(1, "La version est requise"),
  kernel_version: z.string().min(1, "La version du kernel est requise"),
  architecture: z.string().min(1, "L'architecture est requise"),
  file: z.instanceof(File, { message: "Le fichier image est requis" }),
});

type ImageFormValues = z.infer<typeof imageSchema>;

export default function CreateSystemImagePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
  });

  const onSubmit = async (data: ImageFormValues) => {
    setIsUploading(true);
    try {
      // Créer un FormData pour l'upload du fichier
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("version", data.version);
      formData.append("kernel_version", data.kernel_version);
      formData.append("architecture", data.architecture);
      formData.append("file", data.file);

      const response = await fetch("/api/admin/system-images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de la création");

      toast({
        title: "Succès",
        description: "Image système créée avec succès",
      });

      router.push("/admin/system-images");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer l'image système",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nouvelle Image Système</h1>
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

              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Fichier Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept=".img,.qcow2,.raw"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          {...field}
                        />
                        {value && (
                          <p className="text-sm text-gray-500">
                            {(value as File).name}
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Upload en cours...
                    </>
                  ) : (
                    "Créer l'Image"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
