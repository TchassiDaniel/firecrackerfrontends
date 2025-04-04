// Fichier app/dashboard/[id]/page.tsx 

'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, Cpu, HardDrive, Network } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatBytes, formatNumber } from '@/lib/utils';

interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'starting' | 'stopping';
  systemImage: {
    name: string;
  };
  vcpu: number;
  memory_size_mib: number;
  memory_usage_mib: number;
  cpu_usage_percent: number;
  network_rx_bytes: number;
  network_tx_bytes: number;
  disk_size: number;
  created_at: string;
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [vm, setVm] = useState<VirtualMachine | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVmData = async () => {
      try {
        const response = await fetch(`/api/virtual-machines/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch VM data');
        const data = await response.json();
        setVm(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load virtual machine data',
          variant: 'destructive',
        });
      }
    };

    fetchVmData();
    // Poll for updates every 5 seconds if VM is running
    const interval = setInterval(() => {
      if (vm?.status === 'running') fetchVmData();
    }, 5000);

    return () => clearInterval(interval);
  }, [params.id, vm?.status]);

  const handleVmAction = async (action: 'start' | 'stop') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/virtual-machines/${params.id}/${action}`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error(`Failed to ${action} VM`);
      
      toast({
        title: 'Success',
        description: `Virtual machine ${action}ed successfully`,
      });
      
      // Refresh VM data
      const vmResponse = await fetch(`/api/virtual-machines/${params.id}`);
      const vmData = await vmResponse.json();
      setVm(vmData);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} virtual machine`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!vm) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{vm.name}</h1>
        <div className="space-x-2">
          {vm.status === 'stopped' && (
            <Button
              onClick={() => handleVmAction('start')}
              disabled={isLoading}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              Start VM
            </Button>
          )}
          {vm.status === 'running' && (
            <Button
              onClick={() => handleVmAction('stop')}
              disabled={isLoading}
              variant="destructive"
            >
              Stop VM
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Status and Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Status</div>
              <div className="mt-1">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${vm.status === 'running' ? 'bg-green-100 text-green-800' :
                    vm.status === 'stopped' ? 'bg-gray-100 text-gray-800' :
                    vm.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'}`}
                >
                  {vm.status}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span className="text-sm text-gray-600">CPU Usage</span>
              </div>
              <div className="mt-1 text-xl font-semibold">
                {formatNumber(vm.cpu_usage_percent)}%
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <span className="text-sm text-gray-600">Memory Usage</span>
              </div>
              <div className="mt-1 text-xl font-semibold">
                {vm.memory_usage_mib} / {vm.memory_size_mib} MiB
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                <span className="text-sm text-gray-600">Network Traffic</span>
              </div>
              <div className="mt-1 text-sm">
                <div className="flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  {formatBytes(vm.network_rx_bytes)}
                </div>
                <div className="flex items-center gap-1">
                  <ArrowRight className="h-4 w-4" />
                  {formatBytes(vm.network_tx_bytes)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">System</h4>
              <dl className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-600">OS</div>
                <div className="col-span-2 text-sm">{vm.systemImage.name}</div>
                
                <div className="col-span-1 text-sm text-gray-600">vCPUs</div>
                <div className="col-span-2 text-sm">{vm.vcpu}</div>
                
                <div className="col-span-1 text-sm text-gray-600">Memory</div>
                <div className="col-span-2 text-sm">{vm.memory_size_mib} MiB</div>
                
                <div className="col-span-1 text-sm text-gray-600">Disk Size</div>
                <div className="col-span-2 text-sm">{formatBytes(vm.disk_size)}</div>
              </dl>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Details</h4>
              <dl className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm text-gray-600">Created</div>
                <div className="col-span-2 text-sm">
                  {new Date(vm.created_at).toLocaleDateString()}
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/${params.id}/terminal`)}
            >
              Open Terminal
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/${params.id}/edit`)}
            >
              Edit Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
