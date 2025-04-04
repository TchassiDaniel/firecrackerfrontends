// Fichier app/admin/ssh-keys/page.tsx 

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Eye,
  Trash2,
  Search,
  X,
  Key,
} from "lucide-react";
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
        // Charger la liste des utilisateurs
        const usersResponse = await fetch("/api/admin/users");
        if (!usersResponse.ok) throw new Error("Erreur lors du chargement des utilisateurs");
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Charger les clés SSH avec les filtres
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

      // Recharger la liste
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
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clés SSH</h1>

        <div className="flex gap-4">
          <div className="flex gap-2">
            <Select
              value={selectedUser}
              onValueChange={setSelectedUser}
            >
              <SelectTrigger className="w-[200px]">
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

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px]"
              />
              <Button size="icon" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {(selectedUser || searchQuery) && (
              <Button
                variant="outline"
                size="icon"
                onClick={resetFilters}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {sshKeys.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Empreinte</TableHead>
                    <TableHead>Créée le</TableHead>
                    <TableHead>Dernière utilisation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sshKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{key.name}</span>
                          <span className="text-sm text-gray-500">
                            ID: {key.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{key.user.name}</span>
                          <span className="text-sm text-gray-500">
                            {key.user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {key.fingerprint}
                        </code>
                      </TableCell>
                      <TableCell>
                        {format(new Date(key.created_at), "dd/MM/yyyy HH:mm", {
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>
                        {key.last_used_at ? (
                          format(new Date(key.last_used_at), "dd/MM/yyyy HH:mm", {
                            locale: fr,
                          })
                        ) : (
                          <span className="text-gray-500">Jamais utilisée</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push(`/admin/ssh-keys/${key.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-24 text-center">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune clé SSH trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
