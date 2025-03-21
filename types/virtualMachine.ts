// types/virtualMachine.ts
export type VMStatus = 'running' | 'stopped' | 'paused';

export interface VMUser {
  id: string;
  name: string;
  email: string;
}

export interface SystemImage {
  id: string;
  name: string;
  version:string;
  description: string;
  size_gb: number;
  created_at: string;
}

export interface VMOffer {
  id: string;
  name: string;
  cpu_count:number;
  memory_size:number;
  disk_size:number;
}

export interface VMMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_rx_bytes: number;
  network_tx_bytes: number;
  disk_read_bytes: number;
  disk_write_bytes: number;
}

export interface VirtualMachine {
  id: string;
  name: string;
  status: VMStatus;
  vcpu_count: number;
  memory_size_mib: number;
  description:string;
  disk_size_gb: number;
  created_at: string;
  ip_address: string;
  mac_address: string;
  tap_device_name: string;
  tap_ip: string;
  ssh_port: number;
  user: VMUser;
  systemImage: {
    id: string;
    name: string;
  };
  vmOffer: VMOffer;
  metrics: VMMetrics;
}

export interface VMLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export interface CreateVMPayload {
  name: string;
  vcpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  system_image_id: string;
}

export interface UpdateVMPayload {
  name?: string;
}