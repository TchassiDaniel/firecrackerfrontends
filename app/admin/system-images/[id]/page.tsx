// Fichier app/admin/system-images/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon 
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SystemImage {
  id: string;
  name: string;
  version: string;
  description: string;
  created_at: string;
  updated_at: string;
  size: number;
  status: 'active' | 'inactive' | 'deprecated';
}

export default function SystemImageDetailPage({ params }: { params: { id: string } }) {
  const [systemImage, setSystemImage] = useState<SystemImage | null>(null);

  useEffect(() => {
    const fetchSystemImageDetails = async () => {
      try {
        const response = await fetch(`/api/system-images/${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSystemImage(data);
      } catch (error) {
        console.error('Error fetching system image details:', error);
      }
    };
    fetchSystemImageDetails();
  }, [params.id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Détails de l'image système</h1>
      
      {systemImage ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{systemImage.name}</h2>
            <div className="flex space-x-2">
              <button className="text-blue-500 hover:text-blue-700">
                <EyeIcon className="h-5 w-5" />
              </button>
              <button className="text-green-500 hover:text-green-700">
                <PencilIcon className="h-5 w-5" />
              </button>
              <button className="text-red-500 hover:text-red-700">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Version</p>
              <p className="font-medium">{systemImage.version}</p>
            </div>
            <div>
              <p className="text-gray-600">Statut</p>
              <p className="font-medium">{systemImage.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Taille</p>
              <p className="font-medium">{(systemImage.size / (1024 * 1024)).toFixed(2)} Mo</p>
            </div>
            <div>
              <p className="text-gray-600">Créé le</p>
              <p className="font-medium">
                {format(new Date(systemImage.created_at), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-600">Description</p>
            <p>{systemImage.description}</p>
          </div>
        </div>
      ) : (
        <p>Chargement des détails de l'image système...</p>
      )}
    </div>
  );
}
