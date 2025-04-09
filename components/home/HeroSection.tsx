"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth'; // Supposons que vous avez un contexte d'authentification

export default function HeroSection() {
  // Utiliser le hook d'authentification pour vérifier si l'utilisateur est connecté
  const { isAuthenticated, user } = useAuth();
  
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Image d'arrière-plan avec superposition */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/machineV1.jpg" 
          alt="Machines virtuelles" 
          fill 
          className="object-cover brightness-50" 
          priority
        />
      </div>
      
      {/* Forme abstraite décorative */}
      <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden z-0 opacity-20">
        <div className="absolute -right-10 top-10 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
        <div className="absolute right-40 top-40 w-80 h-80 bg-indigo-600 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contenu de gauche */}
          <div className="space-y-8 text-white">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
              Propulsé par Firecracker
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              Déployez des machines virtuelles en quelques secondes
            </h1>
            
            <p className="text-lg md:text-xl leading-relaxed text-gray-200 max-w-xl">
              Bénéficiez d'un déploiement ultra-rapide avec notre plateforme nouvelle génération. Démarrez en quelques minutes avec des machines virtuelles sécurisées, isolées et hautes performances.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              {isAuthenticated ? (
                // Boutons pour utilisateurs connectés
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 h-12 rounded-xl">
                  <Link href="/dashboard">Accéder au dashboard</Link>
                </Button>
              ) : (
                // Boutons pour visiteurs non connectés
                <>
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 h-12 rounded-xl">
                    <Link href="/auth/register">Commencer maintenant</Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="lg" className="border-2 border-white text-blue-700 hover:bg-white/10 font-medium px-8 h-12 rounded-xl backdrop-blur-sm">
                    <Link href="/auth/login">Se connecter</Link>
                  </Button>
                </>
              )}
            </div>
            
            {isAuthenticated ? (
              // Message de bienvenue pour utilisateurs connectés
              <div className="flex items-center space-x-4 pt-6">
                <div className="flex items-center text-3xl">
                    {user && 'avatar' in user && user.avatar ? (
                    <Image src="/images/avatar3.jpeg" width={36} height={36} className="rounded-full border-2 border-white" alt="Votre avatar" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white">
                      <span className="text-white font-semibold">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                  )}
                  <span className="ml-3 font-medium">Bienvenue, {user?.name || 'utilisateur'}</span>
                </div>
              </div>
            ) : (
              // Affichage standard pour visiteurs
              <div className="flex items-center space-x-4 pt-6">
                <div className="flex -space-x-2">
                  <Image src="/images/avatar.jpg" width={36} height={36} className="rounded-full border-2 border-white" alt="User" />
                  <Image src="/images/avatar1.jpg" width={36} height={36} className="rounded-full border-2 border-white" alt="User" />
                  <Image src="/images/avatar2.jpeg" width={36} height={36} className="rounded-full border-2 border-white" alt="User" />
                </div>
                <div className="text-sm">
                  <span className="font-semibold">+2500</span> utilisateurs satisfaits
                </div>
              </div>
            )}
          </div>
          
          {/* Panneau de droite - Terminal */}
          <div className="relative hidden lg:block">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8 relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-xs text-white font-mono">terminal</div>
              </div>
              
              <div className="font-mono text-sm text-gray-200">
                <p className="mb-2">$ iaas-create-vm --name web-server</p>
                <p className="mb-2 text-gray-400">Initializing...</p>
                <p className="mb-2 text-gray-400">Creating VM 'web-server'...</p>
                <p className="mb-2 text-green-400">VM created in 2.4 seconds!</p>
                <p className="mb-2">$ iaas-status web-server</p>
                <p className="mb-2 text-green-400">● Running (CPU: 12%, RAM: 348MB)</p>
                <div className="flex items-center">
                  <span>$</span>
                  <span className="ml-1 inline-block w-2 h-5 bg-white animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}