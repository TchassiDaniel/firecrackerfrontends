// Fichier app/admin/vm-offers/create/page.tsx 

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/components/ui/use-toast';

interface FormData {
  name: string;
  description: string;
  vcpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  price_per_hour: number;
  is_active: boolean;
}

export default function CreateVmOfferPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    vcpu_count: 1,
    memory_size_mib: 128,
    disk_size_gb: 1,
    price_per_hour: 0,
    is_active: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/vm-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Succès',
          description: 'L\'offre VM a été créée avec succès.',
          variant: 'default',
        });
        router.push('/admin/vm-offers');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked,
    }));
  };

  return (
    <div className="container-fluid p-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Nouvelle Offre VM</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de l'offre</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="vcpu_count">Nombre de vCPUs</Label>
                    <Input
                      type="number"
                      id="vcpu_count"
                      name="vcpu_count"
                      value={formData.vcpu_count}
                      onChange={handleInputChange}
                      min={1}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="memory_size_mib">RAM (MiB)</Label>
                    <Input
                      type="number"
                      id="memory_size_mib"
                      name="memory_size_mib"
                      value={formData.memory_size_mib}
                      onChange={handleInputChange}
                      min={128}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="disk_size_gb">Disque (GB)</Label>
                    <Input
                      type="number"
                      id="disk_size_gb"
                      name="disk_size_gb"
                      value={formData.disk_size_gb}
                      onChange={handleInputChange}
                      min={1}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="price_per_hour">Prix par heure ($)</Label>
                  <Input
                    type="number"
                    id="price_per_hour"
                    name="price_per_hour"
                    value={formData.price_per_hour}
                    onChange={handleInputChange}
                    step="0.001"
                    min={0}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="is_active">Activer cette offre</Label>
                </div>
              </div>

              <div className="flex justify-between">
                <Link href="/admin/vm-offers">
                  <Button variant="outline" type="button">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Création...' : 'Créer l\'offre'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
