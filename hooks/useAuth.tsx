"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { getServiceClient } from "@/lib/api/client";

interface User {
  user: User;
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean; // Ajout de cette propriété
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (id: string, hash: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize with null, don't access localStorage during render
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Nouvel état
  const router = useRouter();

  const authClient = getServiceClient("AUTH_SERVICE");

  // Load user from localStorage only after component mounts (client-side only)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true); // Utilisateur authentifié
    }
    setLoading(false);
  }, []);

  const updateUser = (userData: User | null) => {
    setUser(userData);
    setIsAuthenticated(!!userData); // Mettre à jour l'état d'authentification

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authClient.post("/auth/login", {
        email,
        password,
      });

      updateUser(response.data);
      router.push("/dashboard");
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to login",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await authClient.post("/auth/signup", { name, email, password });

      toast({
        title: "Success",
        description: "Please check your email to verify your account.",
      });
      router.push("/auth/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to register",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Supprimer l'utilisateur du localStorage
      localStorage.removeItem("user");

      // Mettre à jour l'état de l'utilisateur et l'authentification
      setUser(null);
      setIsAuthenticated(false);

      // Rediriger vers la page de connexion
      router.push("/");

      // Afficher un toast de confirmation
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      // Gestion des erreurs potentielles
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authClient.post("/auth/forgot-password", { email });

      toast({
        title: "Success",
        description:
          "Password reset instructions have been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to send reset email",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await authClient.post("/auth/reset-password", { token, password });

      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
      });
      router.push("/auth/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to reset password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyEmail = async (id: string, hash: string) => {
    try {
      await authClient.post("/auth/verify-email", { id, hash });

      toast({
        title: "Success",
        description: "Your email has been verified successfully.",
      });
      router.push("/auth/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to verify email",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated, // Ajout de cette propriété
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
