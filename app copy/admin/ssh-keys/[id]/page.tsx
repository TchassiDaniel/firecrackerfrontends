// Fichier app/admin/ssh-keys/[id]/page.tsx 

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Trash2, Key, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SshKey {
  id: string;
  name: string;
  fingerprint: string;
  public_key: string;
  created_at: string;
  last_used_at: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function SshKeyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [sshKey, setSshKey] = useState<SshKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKey = async () => {
      try {
        const response = await fetch(`/api/admin/ssh-keys/${id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement des données");
        const data = await response.json();
        setSshKey(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les détails de la clé SSH",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchKey();
  }, [id, toast]);

  const handleDelete = async () => {
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

      router.push("/admin/ssh-keys");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la clé SSH",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!sshKey) {
    return <div>Clé SSH non trouvée</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Détails de la Clé SSH</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/ssh-keys")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Informations Générales</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Key className="h-4 w-4" />
                Nom
              </h3>
              <p className="mt-1">{sshKey.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <User className="h-4 w-4" />
                Utilisateur
              </h3>
              <div className="mt-1">
                <p>{sshKey.user.name}</p>
                <p className="text-sm text-gray-500">{sshKey.user.email}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Dates
              </h3>
              <div className="mt-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Créée le</Badge>
                  <span>
                    {format(new Date(sshKey.created_at), "dd/MM/yyyy HH:mm", {
                      locale: fr,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Dernière utilisation</Badge>
                  <span>
                    {sshKey.last_used_at
                      ? format(new Date(sshKey.last_used_at), "dd/MM/yyyy HH:mm", {
                          locale: fr,
                        })
                      : "Jamais utilisée"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Détails Techniques</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Empreinte</h3>
              <code className="mt-1 block bg-gray-100 p-2 rounded text-sm">
                {sshKey.fingerprint}
              </code>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Clé Publique</h3>
              <div className="mt-1 relative">
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                  {sshKey.public_key}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
