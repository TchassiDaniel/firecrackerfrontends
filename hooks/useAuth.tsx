'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getServiceClient } from '@/lib/api/client';
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Fonction pour configurer le token d'authentification dans les en-têtes d'Axios
const setupAuthToken = (token: string | null) => {
  if (token) {
    // Configurer le token pour toutes les futures requêtes Axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Supprimer le token si null
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Fonction pour récupérer le token depuis le localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Fonction pour récupérer le token stocké
  const getToken = () => {
    return getAuthToken();
  };
  
  const checkAuth = async () => {
    try {
      // Récupérer le token du localStorage et le configurer si présent
      const token = getAuthToken();
      if (token) {
        setupAuthToken(token);
      } else {
        // Si pas de token, considérer l'utilisateur comme non authentifié
        setUser(null);
        setLoading(false);
        return null;
      }
      
      const authClient = getServiceClient('AUTH_SERVICE');
      const response = await authClient.get('/auth/me');

      setUser(response.data); //on recupere l'utilisateur envoye par serverjs

      return response.data;
    } catch (error: any) {

      // Si l'erreur est 401 ou 403, c'est normal quand non authentifié
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
         setUser(null);

        // Rediriger vers login si on n'est pas déjà sur une page d'auth
        if (!window.location.pathname.startsWith('/auth/')) {
          router.push('/auth/login');
        }
        return null;
      }

      // Pour les autres erreurs, on affiche un toast
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la vérification de l\'authentification',
        variant: 'destructive',
      });

      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const authClient = getServiceClient('AUTH_SERVICE');
      const response = await authClient.post('/auth/login', { 
        email, 
        password 
      });
  
       console.log("reponse du login de useAuth")
     console.log('reponse user data ',response.data)

    // Vérifier que la réponse est réussie (statut 2xx)
    if (response.status >= 200 && response.status < 300) {
      // Extraire le token et les données utilisateur
      const { token, ...userData } = response.data;

      // Stocker le token dans localStorage
      if (typeof window !== 'undefined' && token) {
        localStorage.setItem('auth_token', token);
        // Configurer le token pour les futures requêtes
        setupAuthToken(token);
      }
      
      // Ne stocker que les données utilisateur dans l'état
      setUser(userData);
      
      toast({
        title: 'Succès',
        description: 'Connexion réussie',
      });
      router.push('/dashboard');

      } else {
        // Si la réponse n'est pas réussie, afficher l'erreur
        toast({
          title: 'Erreur',
          description: response.data?.message || 'Erreur lors de la connexion',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      
      // Gestion spécifique des erreurs réseau
      if (error.message === 'Network Error') {
        toast({
          title: 'Erreur de connexion',
          description: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.',
          variant: 'destructive',
        });
      } else if (error.response) {
        // Erreur avec réponse du serveur (401, 403, etc.)
        toast({
          title: 'Erreur',
          description: error.response.data?.message || 'Email ou mot de passe incorrect',
          variant: 'destructive',
        });
      } else if (error.request) {
        // Erreur sans réponse du serveur
        toast({
          title: 'Erreur serveur',
          description: 'Le serveur n\'a pas répondu à la demande. Veuillez réessayer plus tard.',
          variant: 'destructive',
        });
      } else {
        // Autres erreurs
        toast({
          title: 'Erreur',
          description: error.message || 'Une erreur inattendue s\'est produite lors de la connexion',
          variant: 'destructive',
        });
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const authClient = getServiceClient('AUTH_SERVICE');
      const response = await authClient.post('/auth/signup', { 
        name,
        email, 
        password 
      });
  
      console.log("réponse du register de useAuth");
      console.log('réponse user data ', response.data);

      // Vérifier que la réponse est réussie (statut 2xx)
      if (response.status >= 200 && response.status < 300) {
        toast({
          title: 'Succès',
          description: 'Inscription réussie. Veuillez vous connecter.',
        });
        router.push('/auth/login');
      } else {
        // Si la réponse n'est pas réussie, afficher l'erreur
        toast({
          title: 'Erreur',
          description: response.data?.message || 'Erreur lors de l\'inscription',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Gestion spécifique des erreurs réseau
      if (error.message === 'Network Error') {
        toast({
          title: 'Erreur de connexion',
          description: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.',
          variant: 'destructive',
        });
      } else if (error.response) {
        // Erreur avec réponse du serveur
        toast({
          title: 'Erreur',
          description: error.response.data?.message || `Erreur ${error.response.status}: ${error.response.statusText}`,
          variant: 'destructive',
        });
      } else if (error.request) {
        // Erreur sans réponse du serveur
        toast({
          title: 'Erreur serveur',
          description: 'Le serveur n\'a pas répondu à la demande. Veuillez réessayer plus tard.',
          variant: 'destructive',
        });
      } else {
        // Autres erreurs
        toast({
          title: 'Erreur',
          description: error.message || 'Une erreur inattendue s\'est produite lors de l\'inscription',
          variant: 'destructive',
        });
      }
      
      throw error; // Propager l'erreur pour que le composant puisse aussi la gérer si nécessaire
    }
  };

  const logout = async () => {
    try {
      const authClient = getServiceClient('AUTH_SERVICE');
      await authClient.post('/auth/logout');
      
      // Supprimer le token du localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // Supprimer le token des en-têtes Axios
        setupAuthToken(null);
      }
      
      setUser(null);
      router.push('/auth/login');
      toast({
        title: 'Succès',
        description: 'Déconnexion réussie',
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, on déconnecte l'utilisateur localement
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        setupAuthToken(null);
      }
      setUser(null);
      router.push('/auth/login');
      toast({
        title: 'Information',
        description: 'Vous avez été déconnecté',
      });
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      // Récupérer le token du localStorage au chargement initial
      const token = getAuthToken();
      if (token) {
        setupAuthToken(token);
      }
      await checkAuth();
    };
  
    // On ne vérifie l'authentification que si user est null
    if (user === null) {
      initAuth();
    }
  }, [user]); // Ajouter user dans les dépendances

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };