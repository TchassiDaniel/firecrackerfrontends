"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  KeyIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface User {
  id: string;
  name: string;
  email: string;
}

interface SshKey {
  id: string;
  name: string;
  fingerprint: string;
  created_at: string;
  last_used_at: string | null;
  user: User;
}

export default function SshKeysPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sshKeys, setSshKeys] = useState<SshKey[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch("/api/admin/users");
        if (!usersResponse.ok) throw new Error("Erreur lors du chargement des utilisateurs");
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const params = new URLSearchParams();
        if (selectedUser) params.append("user", selectedUser);
        if (searchQuery) params.append("search", searchQuery);

        const keysResponse = await fetch(`/api/admin/ssh-keys?${params}`);
        if (!keysResponse.ok) throw new Error("Erreur lors du chargement des clés SSH");
        const keysData = await keysResponse.json();
        setSshKeys(keysData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedUser, searchQuery, toast]);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette clé SSH ?")) return;

    try {
      const response = await fetch(`/api/admin/ssh-keys/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      toast({
        title: "Succès",
        description: "Clé SSH supprimée avec succès",
      });

      const params = new URLSearchParams();
      if (selectedUser) params.append("user", selectedUser);
      if (searchQuery) params.append("search", searchQuery);

      const keysResponse = await fetch(`/api/admin/ssh-keys?${params}`);
      if (!keysResponse.ok) throw new Error("Erreur lors du chargement des clés SSH");
      const keysData = await keysResponse.json();
      setSshKeys(keysData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la clé SSH",
      });
    }
  };

  const resetFilters = () => {
    setSelectedUser("");
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeKeys = sshKeys.filter(key => key.last_used_at !== null).length;
  const unusedKeys = sshKeys.filter(key => key.last_used_at === null).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clés SSH</h1>
        <p className="text-gray-500 mt-2">
          Gérez les clés SSH pour l'accès sécurisé aux machines virtuelles
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <KeyIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total des clés</p>
                <p className="text-2xl font-bold">{sshKeys.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Clés actives</p>
                <p className="text-2xl font-bold">{activeKeys}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <XCircleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Clés inutilisées</p>
                <p className="text-2xl font-bold">{unusedKeys}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-auto">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Rechercher une clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[250px]"
                />
              </div>

              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <UserCircleIcon className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tous les utilisateurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les utilisateurs</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedUser || searchQuery) && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetFilters}
                  className="shrink-0"
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 shrink-0">
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter une clé
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {sshKeys.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Détails de la clé</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Empreinte</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sshKeys.map((key) => (
                  <TableRow key={key.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{key.name}</span>
                        <span className="text-sm text-gray-500">
                          Créée le {format(new Date(key.created_at), "dd/MM/yyyy", { locale: fr })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{key.user.name}</span>
                        <span className="text-sm text-gray-500">{key.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">
                        {key.fingerprint}
                      </code>
                    </TableCell>
                    <TableCell>
                      {key.last_used_at ? (
                        <div className="flex items-center">
                          <Badge className="bg-green-500">Active</Badge>
                          <span className="text-sm text-gray-500 ml-2 flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {format(new Date(key.last_used_at), "dd/MM/yyyy", { locale: fr })}
                          </span>
                        </div>
                      ) : (
                        <Badge className="bg-yellow-500">Jamais utilisée</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => router.push(`/admin/ssh-keys/${key.id}`)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => handleDelete(key.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <KeyIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Aucune clé SSH trouvée</p>
              <p className="text-gray-400 text-sm mt-1">Ajoutez une nouvelle clé pour commencer</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
