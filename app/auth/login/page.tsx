'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Échec de connexion');
      }

      router.push('/dashboard');
      toast({
        title: 'Succès',
        description: 'Connexion réussie',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Email ou mot de passe invalide',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        {/* Logo et titre */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 mb-4 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl p-3 shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white">
              <path
                d="M3 6.2C3 4.983 3.983 4 5.2 4h13.6c1.217 0 2.2.983 2.2 2.2v1.6c0 1.217-.983 2.2-2.2 2.2H5.2C3.983 10 3 9.017 3 7.8V6.2z"
                fill="currentColor"
              />
              <path
                d="M3 14.2c0-1.217.983-2.2 2.2-2.2h13.6c1.217 0 2.2.983 2.2 2.2v1.6c0 1.217-.983 2.2-2.2 2.2H5.2c-1.217 0-2.2-.983-2.2-2.2v-1.6z"
                fill="currentColor"
              />
              <path
                d="M8 18h8v2.5c0 .828-.672 1.5-1.5 1.5h-5c-.828 0-1.5-.672-1.5-1.5V18z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Bienvenue</h1>
          <p className="text-gray-500 mt-2 text-center">Connectez-vous pour gérer vos machines virtuelles</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                {...register('email')}
                className={`pl-10 w-full py-3 rounded-xl border ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'} bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={`pl-10 w-full py-3 rounded-xl border ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'} bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox 
                id="remember" 
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                {...register('remember')}
              />
              <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Se souvenir de moi
              </Label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Mot de passe oublié?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl flex items-center justify-center shadow-lg transform transition hover:translate-y-px"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion en cours...
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                </svg>
                Se connecter
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Pas encore de compte?{' '}
            <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-800">
              Créer un compte
            </Link>
          </p>
        </div>
        
        {/* Éléments décoratifs */}
        <div className="absolute top-12 left-6 w-24 h-24 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-12 right-6 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-24 left-24 w-24 h-24 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}