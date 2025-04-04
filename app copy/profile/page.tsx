// Fichier app/profile/page.tsx 

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/components/ui/use-toast";
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
import {
  User,
  Shield,
  Key,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Trash2,
} from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("Adresse email invalide"),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, "Le mot de passe actuel est requis"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["password_confirmation"],
});

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Le mot de passe est requis"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const deleteAccountForm = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour du profil");

      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour",
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour du mot de passe");

      toast({
        title: "Succès",
        description: "Votre mot de passe a été mis à jour",
      });

      passwordForm.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le mot de passe",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteAccount = async (data: DeleteAccountFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression du compte");

      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
      });

      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le compte",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Profil */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Profil</h2>
                <p className="text-muted-foreground">
                  Gérez les informations de votre compte
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="John Doe"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-warning/10">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Sécurité</h2>
                <p className="text-muted-foreground">
                  Mettez à jour votre mot de passe
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe actuel</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            type="password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            type="password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            type="password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button variant="warning" type="submit" disabled={isLoading}>
                  <Shield className="mr-2 h-4 w-4" />
                  Mettre à jour le mot de passe
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Zone dangereuse */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Zone dangereuse</h2>
                <p className="text-muted-foreground">
                  Suppression définitive du compte
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...deleteAccountForm}>
              <form className="space-y-4">
                <FormField
                  control={deleteAccountForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Confirmez votre mot de passe pour supprimer le compte"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-destructive mt-2">
                        <AlertTriangle className="inline-block mr-2 h-4 w-4" />
                        Une fois votre compte supprimé, toutes vos ressources et
                        données seront définitivement effacées.
                      </p>
                    </FormItem>
                  )}
                />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" type="button">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer le compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous sûr de vouloir supprimer votre compte ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos données seront
                        définitivement supprimées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deleteAccountForm.handleSubmit(onDeleteAccount)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
