'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getServiceClient } from '@/lib/api/client';


const vmCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  owner_id: z.number().int('Owner ID must be an integer'),
  model_id: z.number().int('Model ID must be an integer'),
  localisation: z.string().min(1, 'Localisation is required'),
  host_id: z.number().int('Host ID must be an integer'),
});

type VmCreateFormData = z.infer<typeof vmCreateSchema>;

export default function CreateVmPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VmCreateFormData>({
    resolver: zodResolver(vmCreateSchema),
  });

  const onSubmit = async (data: VmCreateFormData) => {
    setIsLoading(true);
    try {
      const vmsClient = getServiceClient('VM_SERVICE');
      const response = await vmsClient.post('/vms', data);

      toast({
        title: 'Success',
        description: 'VM created successfully',
      });

      router.push('/admin/all-vms');
    } catch (error) {
      console.error('Error creating VM:', error);
      toast({
        title: 'Error',
        description: 'Failed to create VM',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New VM</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            {...register('name')}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <Label htmlFor="owner_id">Owner ID</Label>
          <Input
            id="owner_id"
            type="number"
            {...register('owner_id')}
          />
          {errors.owner_id && <p className="text-red-500">{errors.owner_id.message}</p>}
        </div>

        <div>
          <Label htmlFor="model_id">Model ID</Label>
          <Input
            id="model_id"
            type="number"
            {...register('model_id')}
          />
          {errors.model_id && <p className="text-red-500">{errors.model_id.message}</p>}
        </div>

        <div>
          <Label htmlFor="localisation">Localisation</Label>
          <Input
            id="localisation"
            type="text"
            {...register('localisation')}
          />
          {errors.localisation && <p className="text-red-500">{errors.localisation.message}</p>}
        </div>

        <div>
          <Label htmlFor="host_id">Host ID</Label>
          <Input
            id="host_id"
            type="number"
            {...register('host_id')}
          />
          {errors.host_id && <p className="text-red-500">{errors.host_id.message}</p>}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create VM'}
        </Button>
      </form>
    </div>
  );
}