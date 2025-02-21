// Fichier app/admin/users/[id]/page.tsx 

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

interface VirtualMachine {
  id: string;
  name: string;
  status: "running" | "stopped" | "pending";
  created_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  virtualMachines: VirtualMachine[];
}

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Session {
  user?: SessionUser | null;
}

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement des données");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les détails de l'utilisateur",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      toast({
        title: "Succès",
        description: "L'utilisateur a été supprimé avec succès",
      });

      router.push("/admin/users");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "stopped":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Détails de l'Utilisateur</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-600">
                Informations Générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Nom</label>
                  <p className="mt-1">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Rôle</label>
                  <div className="mt-1">
                    <Badge
                      variant={user.role === "admin" ? "destructive" : "default"}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    Date d'inscription
                  </label>
                  <p className="mt-1">
                    {format(new Date(user.created_at), "dd/MM/yyyy HH:mm", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-600">
                Machines Virtuelles
              </h3>
              {user.virtualMachines.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Créée le</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.virtualMachines.map((vm) => (
                        <TableRow key={vm.id}>
                          <TableCell>{vm.name}</TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(vm.status)}
                              variant="outline"
                            >
                              {vm.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(vm.created_at), "dd/MM/yyyy", {
                              locale: fr,
                            })}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                router.push(`/admin/all-vms/${vm.id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500">Aucune machine virtuelle</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/users")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/users/${id}/edit`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                {session?.user?.id !== id && (
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
