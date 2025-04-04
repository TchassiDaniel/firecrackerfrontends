"use client";

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
import React from 'react';

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  password_confirmation: z.string(),
  terms: z.boolean().refine((value) => value, {
    message: "Vous devez accepter les conditions d'utilisation et la politique de confidentialité",
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["password_confirmation"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');
  
  // Calcul de la force du mot de passe
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    
    return strength;
  };

  // Mettre à jour la force du mot de passe lorsqu'il change
  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Échec d\'inscription');
      }

      router.push('/auth/verify-email');
      toast({
        title: 'Succès',
        description: 'Inscription réussie. Veuillez vérifier votre email.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'L\'inscription a échoué. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4 relative">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/3 w-36 h-36 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 z-10">
        {/* Logo et titre */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 mb-4 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl p-3 shadow-lg">
            <svg 
              viewBox="0 0 24 24" 
              className="w-full h-full text-white"
              fill="currentColor"
            >
              <path d="M20 12a2 2 0 11-4 0 2 2 0 014 0z" />
              <path d="M4 18v-2a2 2 0 012-2h8a2 2 0 012 2v2" />
              <path d="M12 15v2" />
              <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
              <path d="M18 8a2 2 0 100-4 2 2 0 000 4z" />
              <path d="M6 8a2 2 0 100-4 2 2 0 000 4z" />
              <path d="M6 16a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Créer un compte</h1>
          <p className="text-gray-500 mt-2 text-center">Commencez votre voyage cloud avec nous</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nom complet</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register('name')}
                className={`pl-10 w-full py-3 rounded-xl border ${errors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'} bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

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
            {password && (
              <div className="mt-2">
                <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      passwordStrength <= 2 ? 'bg-red-500' : 
                      passwordStrength <= 3 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {passwordStrength <= 2 && 'Mot de passe faible'}
                  {passwordStrength > 2 && passwordStrength <= 3 && 'Mot de passe moyen'}
                  {passwordStrength > 3 && 'Mot de passe fort'}
                </p>
              </div>
            )}
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">Confirmer le mot de passe</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="••••••••"
                {...register('password_confirmation')}
                className={`pl-10 w-full py-3 rounded-xl border ${errors.password_confirmation ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'} bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.password_confirmation && (
              <p className="text-sm text-red-500 mt-1">{errors.password_confirmation.message}</p>
            )}
          </div>

          <div className="flex items-start space-x-2 mt-4">
            <Checkbox 
              id="terms" 
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1" 
              {...register('terms')} 
            />
            <Label htmlFor="terms" className="text-sm text-gray-600">
              J'accepte les{' '}
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Conditions d'utilisation
              </Link>{' '}
              et la{' '}
              <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Politique de confidentialité
              </Link>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-500 mt-1">{errors.terms.message}</p>
          )}

          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl flex items-center justify-center shadow-lg transform transition hover:translate-y-px mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création du compte...
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Créer mon compte
              </span>
            )}
          </Button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Déjà inscrit?{' '}
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-800">
                Connectez-vous
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}