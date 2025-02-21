// Fichier app/admin/ssh-keys/[id]/edit/page.tsx 

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
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const sshKeySchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  public_key: z.string().min(20, "La clé publique SSH n'est pas valide"),
});

type SshKeyFormValues = z.infer<typeof sshKeySchema>;

interface SshKey {
  id: string;
  name: string;
  description: string | null;
  public_key: string;
  user_id: string;
  created_at: string;
}

export default function EditSshKeyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<SshKeyFormValues>({
    resolver: zodResolver(sshKeySchema),
  });

  useEffect(() => {
    const fetchSshKey = async () => {
      try {
        const response = await fetch(`/api/admin/ssh-keys/${id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement de la clé SSH");
        const data: SshKey = await response.json();
        
        form.reset({
          name: data.name,
          description: data.description || "",
          public_key: data.public_key,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la clé SSH",
        });
        router.push("/admin/ssh-keys");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSshKey();
  }, [id, form, router, toast]);

  const onSubmit = async (data: SshKeyFormValues) => {
    try {
      const response = await fetch(`/api/admin/ssh-keys/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      toast({
        title: "Succès",
        description: "Clé SSH mise à jour avec succès",
      });

      router.push("/admin/ssh-keys");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la clé SSH",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modifier la Clé SSH</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/ssh-keys")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Informations de la Clé</h2>
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
                      <Input {...field} placeholder="Ma clé SSH" />
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
                    <FormLabel>Description (optionnelle)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Une description de la clé SSH"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="public_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clé Publique SSH</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="ssh-rsa AAAAB3NzaC1yc2E..."
                        rows={5}
                        className="font-mono text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">
                  Mettre à jour la Clé
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
