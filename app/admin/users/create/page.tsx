'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeftIcon, UserPlusIcon, UserIcon, EnvelopeIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  password_confirmation: z.string(),
  role: z.enum(['user', 'admin']),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
});

type UserFormData = z.infer<typeof userSchema>;

export default function CreateUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'user',
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      toast({
        title: 'Succès',
        description: 'Utilisateur créé avec succès',
        variant: 'default',
      });

      router.push('/admin/users');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'utilisateur',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Créer un Nouvel Utilisateur</h1>
          <p className="text-gray-500 mt-2">
            Ajoutez un nouvel utilisateur à la plateforme avec des permissions spécifiques.
          </p>
        </div>
        <Link href="/admin/users">
          <Button variant="outline" className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Retour
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              {/* Informations de base */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Informations de base</h2>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                      Nom complet
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className={`mt-1.5 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1.5">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                      Adresse email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={`mt-1.5 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1.5">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sécurité */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Sécurité</h2>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <KeyIcon className="h-4 w-4 text-gray-500" />
                      Mot de passe
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      {...register('password')}
                      className={`mt-1.5 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1.5">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password_confirmation" className="flex items-center gap-2">
                      <KeyIcon className="h-4 w-4 text-gray-500" />
                      Confirmer le mot de passe
                    </Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      {...register('password_confirmation')}
                      className={`mt-1.5 ${errors.password_confirmation ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="••••••••"
                    />
                    {errors.password_confirmation && (
                      <p className="text-sm text-red-500 mt-1.5">
                        {errors.password_confirmation.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Permissions</h2>
                <div>
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-gray-500" />
                    Rôle de l'utilisateur
                  </Label>
                  <Select
                    value={watch('role')}
                    onValueChange={(value: 'user' | 'admin') => setValue('role', value)}
                  >
                    <SelectTrigger className="mt-1.5 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur standard</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-500 mt-1.5">{errors.role.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Création en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlusIcon className="h-4 w-4" />
                    Créer l'utilisateur
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
