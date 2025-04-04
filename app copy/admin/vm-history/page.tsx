// Fichier app/admin/vm-history/page.tsx 

"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  X,
  Activity,
  Server,
  User,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface VmHistoryEntry {
  id: string;
  virtual_machine: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  action: "start" | "stop" | "create" | "delete" | "update";
  details: string;
  status: "success" | "error" | "warning";
  created_at: string;
}

export default function VmHistoryPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<VmHistoryEntry[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger la liste des utilisateurs
        const usersResponse = await fetch("/api/admin/users");
        if (!usersResponse.ok) throw new Error("Erreur lors du chargement des utilisateurs");
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Charger l'historique avec les filtres
        const params = new URLSearchParams();
        if (selectedUser) params.append("user", selectedUser);
        if (selectedAction) params.append("action", selectedAction);
        if (searchQuery) params.append("search", searchQuery);

        const historyResponse = await fetch(`/api/admin/vm-history?${params}`);
        if (!historyResponse.ok) throw new Error("Erreur lors du chargement de l'historique");
        const historyData = await historyResponse.json();
        setHistory(historyData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger l'historique",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedUser, selectedAction, searchQuery, toast]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "start":
        return <Badge className="bg-green-500">Démarrage</Badge>;
      case "stop":
        return <Badge className="bg-orange-500">Arrêt</Badge>;
      case "create":
        return <Badge className="bg-blue-500">Création</Badge>;
      case "delete":
        return <Badge className="bg-red-500">Suppression</Badge>;
      case "update":
        return <Badge className="bg-purple-500">Modification</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const resetFilters = () => {
    setSelectedUser("");
    setSelectedAction("");
    setSearchQuery("");
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historique des Machines Virtuelles</h1>

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

            <Select
              value={selectedAction}
              onValueChange={setSelectedAction}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Toutes les actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les actions</SelectItem>
                <SelectItem value="start">Démarrage</SelectItem>
                <SelectItem value="stop">Arrêt</SelectItem>
                <SelectItem value="create">Création</SelectItem>
                <SelectItem value="delete">Suppression</SelectItem>
                <SelectItem value="update">Modification</SelectItem>
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

            {(selectedUser || selectedAction || searchQuery) && (
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
          {history.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Machine Virtuelle</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {format(new Date(entry.created_at), "dd/MM/yyyy HH:mm", {
                            locale: fr,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-gray-500" />
                          {entry.virtual_machine.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <p>{entry.user.name}</p>
                            <p className="text-sm text-gray-500">
                              {entry.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-gray-500" />
                          {getActionBadge(entry.action)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">{entry.details}</p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusIcon(entry.status)}
                          variant="outline"
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-24 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun historique trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
