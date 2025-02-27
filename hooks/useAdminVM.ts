import { useState, useEffect } from 'react';
import { getServiceClient } from '@/lib/api/client';

interface SystemImage {
  id: string;
  name: string;
}

interface VMOffer {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'creating';
  vcpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  created_at: string;
  ip_address: string;
  mac_address: string;
  tap_device_name: string;
  tap_ip: string;
  user: User;
  systemImage: SystemImage;
  vmOffer: VMOffer;
  metrics?: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
    disk_read_bytes: number;
    disk_write_bytes: number;
  };
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export const useAdminVM = (vmId: string) => {
  const [vm, setVM] = useState<VirtualMachine | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const vmClient = getServiceClient('VM_SERVICE');

  const fetchVM = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vmClient.get(`/api/admin/vms/${vmId}`);
      setVM(response.data);
    } catch (err) {
      setError('Erreur lors du chargement de la machine virtuelle');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await vmClient.get(`/api/admin/vms/${vmId}/logs`);
      setLogs(response.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const updateVMStatus = async (action: 'start' | 'stop' | 'restart') => {
    try {
      await vmClient.post(`/api/admin/vms/${vmId}/${action}`);
      await fetchVM();
    } catch (err) {
      console.error(`Error ${action} VM:`, err);
      throw err;
    }
  };

  const deleteVM = async () => {
    try {
      await vmClient.delete(`/api/admin/vms/${vmId}`);
    } catch (err) {
      console.error('Error deleting VM:', err);
      throw err;
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  useEffect(() => {
    fetchVM();
    fetchLogs();
    // Mettre à jour les métriques toutes les 10 secondes
    const metricsInterval = setInterval(fetchVM, 10000);
    return () => clearInterval(metricsInterval);
  }, [vmId]);

  return {
    vm,
    logs,
    isLoading,
    error,
    updateVMStatus,
    deleteVM,
    formatBytes,
    refreshVM: fetchVM,
    refreshLogs: fetchLogs
  };
};
