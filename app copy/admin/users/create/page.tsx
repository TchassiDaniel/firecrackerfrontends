// Fichier app/admin/users/create/page.tsx 

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
import { ArrowLeftIcon, UserPlusIcon } from '@heroicons/react/24/outline';
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
    <div className="container-fluid p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Créer un Nouvel Utilisateur</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    {...register('password_confirmation')}
                    className={errors.password_confirmation ? 'border-red-500' : ''}
                  />
                  {errors.password_confirmation && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={watch('role')}
                    onValueChange={(value: 'user' | 'admin') => setValue('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Link href="/admin/users">
                  <Button variant="outline" type="button">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                </Link>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création en cours...
                    </div>
                  ) : (
                    <>
                      <UserPlusIcon className="h-4 w-4 mr-2" />
                      Créer l'utilisateur
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
